import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Plus, Target, TrendingUp, Calendar, Edit2, Trash2, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importação relativa
import { Goals, Goal } from '../../services/firebase'; 
import GoalFormModal from '@/components/GoalFormModal';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [hasError, setHasError] = useState(false); // Estado para erro/retry

  // READ: Função para carregar objetivos (com Retry embutido no serviço)
  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            setGoals([]);
            return;
        }
        
        const fetchedGoals = await Goals.fetchAll(userId);
        setGoals(fetchedGoals);

    } catch (error: any) {
        Alert.alert('Erro de Conexão', `Não foi possível carregar os objetivos: ${error.message}`);
        setHasError(true);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // CREATE: Abre o modal em modo de criação
  const handleCreateGoal = () => { setEditingGoal(null); setIsModalVisible(true); };
  
  // UPDATE: Abre o modal em modo de edição
  const handleEditGoal = (goal: Goal) => { setEditingGoal(goal); setIsModalVisible(true); };

  // DELETE: Função para excluir objetivo
  const handleDeleteGoal = (goalId: string, goalName: string) => {
    Alert.alert(
        'Excluir Objetivo',
        `Tem certeza que deseja excluir o objetivo "${goalName}"? Esta ação é irreversível.`,
        [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await Goals.delete(goalId); // Chamada DELETE para o Firebase
                        Alert.alert('Sucesso', `Objetivo "${goalName}" excluído.`);
                        fetchGoals(); // Recarrega a lista
                    } catch (error: any) {
                        Alert.alert('Erro', `Falha ao excluir objetivo: ${error.message || 'Verifique sua conexão.'}`);
                    }
                }
            }
        ]
    );
  };

  // Cálculos de progresso
  const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalGoalAmount > 0 ? Math.round((totalCurrentAmount / totalGoalAmount) * 100) : 0;
  
  // Renderização condicional para o estado de carregamento
  if (isLoading) {
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={{ marginTop: 10, color: '#666' }}>Buscando seus objetivos...</Text>
        </View>
    );
  }

  // Renderização condicional para o estado de erro (Interrupção tratada)
  if (hasError) {
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.errorFeedbackText}>Falha ao carregar objetivos.</Text>
            <Text style={styles.emptySubtext}>Verifique sua conexão de internet.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchGoals}>
                <RefreshCw size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Objetivos</Text>
          <Text style={styles.subtitle}>Transforme sonhos em metas alcançáveis</Text>
        </View>

        {/* Overall Progress */}
        <LinearGradient
          colors={['#51cf66', '#40c057']}
          style={styles.overallCard}
        >
          <View style={styles.overallContent}>
            <Target size={32} color="#FFFFFF" />
            <Text style={styles.overallTitle}>Progresso Geral</Text>
            <Text style={styles.overallAmount}>
              R${totalCurrentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R${totalGoalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${overallProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>{overallProgress}% concluído</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Individual Goals */}
        <View style={styles.goalsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seus Objetivos</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleCreateGoal}>
              <Plus size={20} color="#667eea" />
            </TouchableOpacity>
          </View>

          {goals.length === 0 ? (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Você ainda não tem objetivos cadastrados.</Text>
                <Text style={styles.emptySubtext}>Comece agora a transformar seus impulsos em metas reais!</Text>
                <TouchableOpacity style={styles.createGoalButtonSmall} onPress={handleCreateGoal}>
                    <Text style={styles.createGoalButtonText}>Criar Primeiro Objetivo</Text>
                </TouchableOpacity>
            </View>
          ) : (
            goals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalTimeframe}>{goal.timeframe}</Text>
                  </View>
                  <View style={styles.goalAmount}>
                    <Text style={styles.goalCurrentAmount}>
                      R${(goal.currentAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                    <Text style={styles.goalTargetAmount}>
                      de R${goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                  </View>
                </View>

                <View style={styles.goalProgress}>
                  <View style={styles.goalProgressBar}>
                    <View style={[styles.goalProgressFill, { width: `${goal.progress || 0}%` }]} />
                  </View>
                  <Text style={styles.goalProgressText}>{goal.progress || 0}%</Text>
                </View>

                <View style={styles.goalActions}>
                    <View style={styles.goalStat}>
                      <TrendingUp size={16} color="#51cf66" />
                      <Text style={styles.goalStatText}>Em progresso</Text>
                    </View>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditGoal(goal)}>
                            <Edit2 size={16} color="#667eea" />
                            <Text style={styles.actionButtonText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteGoal(goal.id, goal.name)}>
                            <Trash2 size={16} color="#ff6b6b" />
                            <Text style={[styles.actionButtonText, { color: '#ff6b6b' }]}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </View>
            ))
          )}

          {/* Suggestion Card */}
          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionTitle}>Dica para seus objetivos:</Text>
            <Text style={styles.suggestionText}>
              Com R$125 que você pouparia das apostas, você já consegue acelerar em 20% seus objetivos. Todo pequeno valor investido hoje se multiplica no futuro!
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createGoalButton} onPress={handleCreateGoal}>
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.createGoalButtonText}>Criar Novo Objetivo</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Modal para Criação/Edição */}
      <GoalFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        initialData={editingGoal}
        onSave={fetchGoals}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  overallCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  overallContent: {
    alignItems: 'center',
  },
  overallTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  overallAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  goalsSection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  goalTimeframe: {
    fontSize: 14,
    color: '#999',
  },
  goalAmount: {
    alignItems: 'flex-end',
  },
  goalCurrentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#51cf66',
  },
  goalTargetAmount: {
    fontSize: 12,
    color: '#999',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  goalProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#51cf66',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#51cf66',
    minWidth: 32,
  },
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  goalStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  goalStatText: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#667eea',
  },
  suggestionCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  createGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#667eea',
    marginHorizontal: 24,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 100,
  },
  createGoalButtonSmall: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  createGoalButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    marginVertical: 20,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  // NOVOS ESTILOS PARA TRATAMENTO DE ERRO/RETRY
  errorFeedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});