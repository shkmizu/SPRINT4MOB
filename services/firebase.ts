import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    deleteUser, 
    User,
    signOut
} from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where 
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Sua configuração fornecida pelo Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUSAa_RpA7scjlx5Ah80QbWuiSihbS0mw",
  authDomain: "reveste-36d73.firebaseapp.com",
  projectId: "reveste-36d73",
  storageBucket: "reveste-36d73.firebasestorage.app",
  messagingSenderId: "517630020443",
  appId: "1:517630020443:web:0ab52b13115248d5a4a87e",
  measurementId: "G-XLHH4FHZW4"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias dos serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- Modelos de Dados (Interfaces) ---
export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    progress: number;
    timeframe: string;
    userId: string;
}

export interface Impulse {
    id: string;
    amount: number;
    betType: string;
    isRecurring: boolean;
    feeling: string;
    date: string;
    userId: string;
}

// --- Função Auxiliar: Retry com atraso exponencial (Tratamento de Interrupção) ---
async function retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    let lastError: Error | null = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;
            // Atraso antes de tentar novamente: 100ms * (2^i)
            const delay = 100 * Math.pow(2, i);
            if (i < maxRetries - 1) {
                console.warn(`[Retry #${i + 1}] Falha na comunicação. Tentando novamente em ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    // Lança um erro claro após todas as tentativas falharem
    throw new Error(`Falha na operação após ${maxRetries} tentativas. Verifique a conexão e tente novamente. Detalhe: ${lastError?.message}`);
}


// --- Funções de Autenticação e Usuário ---
export const Auth = {
    login: async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await AsyncStorage.setItem('userId', user.uid);
        return user.uid;
    },
    deleteAccount: async (user: User, userId: string) => {
        // 1. Apagar dados do Firestore (Metas e Impulsos)
        const goalQuery = query(collection(db, "goals"), where("userId", "==", userId));
        const impulseQuery = query(collection(db, "impulses"), where("userId", "==", userId));

        const [goalDocs, impulseDocs] = await Promise.all([
            getDocs(goalQuery),
            getDocs(impulseQuery)
        ]);

        const deletePromises = [
            ...goalDocs.docs.map(d => deleteDoc(doc(db, "goals", d.id))),
            ...impulseDocs.docs.map(d => deleteDoc(doc(db, "impulses", d.id)))
        ];

        await Promise.all(deletePromises);

        // 2. Apagar o usuário do Firebase Authentication
        await deleteUser(user);
        await AsyncStorage.clear();
    },
    logout: async () => {
        await signOut(auth);
        await AsyncStorage.clear(); 
    }
};

// --- Funções CRUD de Dados (Firestore) ---

const goalsCollection = collection(db, "goals");
const impulsesCollection = collection(db, "impulses");

export const Goals = {
    fetchAll: async (userId: string): Promise<Goal[]> => { // READ All com Retry
        const operation = async () => {
            const q = query(goalsCollection, where("userId", "==", userId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
        }
        return retryOperation(operation, 3);
    },
    create: async (data: Omit<Goal, 'id'>): Promise<Goal> => { // CREATE
        const docRef = await addDoc(goalsCollection, data);
        return { id: docRef.id, ...data } as Goal;
    },
    update: async (goalId: string, data: Partial<Goal>): Promise<void> => { // UPDATE
        const goalDoc = doc(db, "goals", goalId);
        await updateDoc(goalDoc, data);
    },
    delete: async (goalId: string): Promise<void> => { // DELETE
        const goalDoc = doc(db, "goals", goalId);
        await deleteDoc(goalDoc);
    },
};

export const Impulses = {
    register: async (data: Omit<Impulse, 'id'>): Promise<Impulse> => { // CREATE
        const docRef = await addDoc(impulsesCollection, data);
        return { id: docRef.id, ...data };
    },
    
    // READ de dados consolidados para o Dashboard com Retry
    fetchDashboardData: async (userId: string) => {
        
        const operation = async () => {
            // CORREÇÃO: Usar a query filtrada pelo userId para respeitar as regras de segurança
            const impulseQuery = query(impulsesCollection, where("userId", "==", userId));
            const impulseSnapshot = await getDocs(impulseQuery);
            
            const totalImpulses = impulseSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
            const daysWithoutBetting = 30; 
            
            const data = {
                userName: "Vitor",
                moneySaved: totalImpulses * 2, 
                dailySavings: (totalImpulses * 2) / daysWithoutBetting,
                daysWithoutBetting: daysWithoutBetting,
                intelligenceScore: 75,
                investmentPotential: { spent: totalImpulses, tesouro: totalImpulses * 1.2, etfs: totalImpulses * 1.5 }
            };
            return data;
        };

        return retryOperation(operation, 3); 
    }
};