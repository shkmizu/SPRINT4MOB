import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, DollarSign, Target, Save } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importação relativa para o serviço Firebase
import { Goals, Goal } from '../services/firebase';

interface GoalFormModalProps {
  visible: boolean;
  initialData: Goal | null; // Se for null, é CREATE. Se tiver dados, é UPDATE.
  onClose: () => void;
  onSave: () => void; // Para atualizar a lista de objetivos após salvar
}

export default function GoalFormModal({ visible, initialData, onClose, onSave }: GoalFormModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [targetAmount, setTargetAmount] = useState(initialData?.targetAmount.toString() || '');
  const [timeframe, setTimeframe] = useState(initialData?.timeframe || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  // Atualiza o estado quando o initialData muda
  useEffect(() => {
    setName(initialData?.name || '');
    setTargetAmount(initialData?.targetAmount.toString() || '');
    setTimeframe(initialData?.timeframe || '');
  }, [initialData, visible]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(targetAmount.replace(',', '.'));
    
    // Validação de erro: Campos obrigatórios
    if (!name || isNaN(parsedAmount) || parsedAmount <= 0 || !timeframe) {
      Alert.alert('Atenção', 'Preencha o nome, valor da meta e prazo corretamente.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuário não autenticado. Faça login novamente.');

      const goalData: Omit<Goal, 'id'> = {
        name,
        targetAmount: parsedAmount,
        timeframe,
        // Campos que o usuário não edita no formulário simples
        currentAmount: initialData?.currentAmount || 0,
        progress: initialData?.progress || 0,
        userId,
      };

      if (isEditMode && initialData) {
        // Operação UPDATE
        await Goals.update(initialData.id, goalData);
        Alert.alert('Sucesso', `Objetivo "${name}" atualizado!`);
      } else {
        // Operação CREATE
        await Goals.create(goalData);
        Alert.alert('Sucesso', `Novo objetivo "${name}" criado!`);
      }

      onSave(); // Recarrega a lista
      onClose();

    } catch (error: any) {
      // Feedback claro e informativo para o usuário
      Alert.alert('Erro ao Salvar', `Falha ao salvar objetivo: ${error.message || 'Verifique sua conexão.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? "pageSheet" : "overFullScreen"}
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={isEditMode ? ['#667eea', '#764ba2'] : ['#51cf66', '#40c057']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Editar Objetivo' : 'Criar Novo Objetivo'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          {isEditMode ? 'Ajuste os detalhes da sua meta.' : 'Transforme o dinheiro poupado em metas reais.'}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Objetivo</Text>
            <View style={styles.inputContainer}>
              <Target size={20} color="#999" />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Reserva de Emergência"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor Total da Meta (R$)</Text>
            <View style={styles.inputContainer}>
              <DollarSign size={20} color="#999" />
              <TextInput
                style={styles.input}
                value={targetAmount}
                onChangeText={setTargetAmount}
                placeholder="5000.00"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prazo Estimado (Ex: 12 meses)</Text>
            <View style={styles.inputContainer}>
              <Target size={20} color="#999" />
              <TextInput
                style={styles.input}
                value={timeframe}
                onChangeText={setTimeframe}
                placeholder="Ex: 12 meses restantes"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isEditMode ? styles.editButton : styles.createButton]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
                 <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
                <>
                    <Save size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>{isEditMode ? 'Salvar Alterações' : 'Criar Objetivo'}</Text>
                </>
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
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  createButton: {
    backgroundColor: '#51cf66',
  },
  editButton: {
    backgroundColor: '#667eea',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});