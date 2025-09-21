import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Plus, Target, TrendingUp, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Goals() {
  const goals = [
    {
      id: 1,
      name: 'Reserva de Emergência',
      targetAmount: 2500.00,
      currentAmount: 1625.00,
      progress: 65,
      timeframe: '8 meses restantes',
    },
    {
      id: 2,
      name: 'Viagem para Europa',
      targetAmount: 3200.00,
      currentAmount: 960.00,
      progress: 30,
      timeframe: '12 meses restantes',
    },
  ];

  const totalGoalAmount = 5700.00;
  const totalCurrentAmount = 2585.00;
  const overallProgress = Math.round((totalCurrentAmount / totalGoalAmount) * 100);

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
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#667eea" />
            </TouchableOpacity>
          </View>

          {goals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalTimeframe}>{goal.timeframe}</Text>
                </View>
                <View style={styles.goalAmount}>
                  <Text style={styles.goalCurrentAmount}>
                    R${goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                  <Text style={styles.goalTargetAmount}>
                    de R${goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>

              <View style={styles.goalProgress}>
                <View style={styles.goalProgressBar}>
                  <View style={[styles.goalProgressFill, { width: `${goal.progress}%` }]} />
                </View>
                <Text style={styles.goalProgressText}>{goal.progress}%</Text>
              </View>

              <View style={styles.goalStats}>
                <View style={styles.goalStat}>
                  <TrendingUp size={16} color="#51cf66" />
                  <Text style={styles.goalStatText}>Em progresso</Text>
                </View>
                <View style={styles.goalStat}>
                  <Calendar size={16} color="#999" />
                  <Text style={styles.goalStatText}>Meta mensal: R$312</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Suggestion Card */}
          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionTitle}>Dica para seus objetivos:</Text>
            <Text style={styles.suggestionText}>
              Com R$125 que você pouparia das apostas, você já consegue acelerar em 20% seus objetivos. Todo pequeno valor investido hoje se multiplica no futuro!
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createGoalButton}>
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.createGoalButtonText}>Criar Novo Objetivo</Text>
        </TouchableOpacity>
      </ScrollView>
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
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  createGoalButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});