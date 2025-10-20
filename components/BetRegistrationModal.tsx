import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Calendar, DollarSign, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importação relativa para o serviço Firebase
import { Impulses } from '../services/firebase'; 

interface BetRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onRegistered: () => void; // Para atualizar o Dashboard
}

export default function BetRegistrationModal({ visible, onClose, onRegistered }: BetRegistrationModalProps) {
  const [amount, setAmount] = useState('');
  const [betType, setBetType] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [feeling, setFeeling] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para loading

  const betTypes = [
    'Esportes',
    'Cassino Online', 
    'Loteria',
    'Apostas Esportivas',
    'Poker',
    'Outros'
  ];

  const handleSubmit = async () => {
    // Validação de entrada
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!amount || isNaN(parsedAmount) || !betType) {
        Alert.alert('Atenção', 'O valor deve ser um número válido e o tipo da aposta é obrigatório.');
        return; 
    }
    
    setIsSubmitting(true);
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
             Alert.alert('Erro', 'Sessão inválida. Faça login novamente.');
             onClose();
             return;
        }

        const impulseData = {
            userId,
            amount: parsedAmount, // Valor formatado para float
            betType,
            isRecurring,
            feeling,
            date,
        };

        await Impulses.register(impulseData); // CREATE no Firebase
        
        // Limpa o formulário e fecha
        setAmount('');
        setBetType('');
        setIsRecurring(false);
        setFeeling('');
        setDate(new Date().toISOString().split('T')[0]);
        
        onRegistered(); // Notifica o dashboard para recarregar
        onClose();
        Alert.alert('Sucesso', 'Impulso registrado e transformado em potencial de economia!');

    } catch (error: any) {
        Alert.alert('Erro no Registro', `Falha ao registrar impulso: ${error.message || 'Verifique sua conexão.'}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#ff6b6b', '#ee5a52']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <AlertTriangle size={24} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Registrar Impulso</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Reconhecer o primeiro passo para transformar
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor que você pensou em apostar</Text>
            <View style={styles.inputContainer}>
              <DollarSign size={20} color="#999" />
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="R$ 0,00"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de aposta</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {betTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.chip,
                      betType === type && styles.chipSelected
                    ]}
                    onPress={() => setBetType(type)}
                  >
                    <Text style={[
                      styles.chipText,
                      betType === type && styles.chipTextSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#999" />
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="2024-06-15"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>É um padrão recorrente?</Text>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              thumbColor={isRecurring ? '#667eea' : '#f4f3f4'}
              trackColor={{ false: '#e0e0e0', true: '#c7d2fe' }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>O que você estava sentindo? (opcional)</Text>
            <TextInput
              style={styles.textArea}
              value={feeling}
              onChangeText={setFeeling}
              placeholder="Ex: ansiedade, tédio, estresse..."
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.supportMessage}>
            <AlertTriangle size={20} color="#ffa726" />
            <Text style={styles.supportText}>
              Você está no controle! Reconhecer é um primeiro passo. Cada
              registro nos ajuda a construir um plano melhor para
              seus objetivos.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
                 <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
                <Text style={styles.submitButtonText}>Registrar e Transformar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  form: {
    padding: 24,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supportMessage: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff8e1',
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  supportText: {
    flex: 1,
    fontSize: 14,
    color: '#f57c00',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#51cf66',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});