import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { PiggyBank, TrendingUp, Plus, Target, ChartBar as BarChart3, TriangleAlert as AlertTriangle, Clock, RefreshCw } from 'lucide-react-native';
import BetRegistrationModal from '@/components/BetRegistrationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importação relativa para o serviço Firebase
import { Impulses } from '../../services/firebase'; 

// Estrutura de dados para o Dashboard
interface DashboardData {
    userName: string;
    moneySaved: number;
    dailySavings: number;
    daysWithoutBetting: number;
    intelligenceScore: number;
    investmentPotential: { spent: number; tesouro: number; etfs: number };
}

// Dados iniciais ou de fallback
const initialData: DashboardData = {
    userName: "Vitor",
    moneySaved: 1250.00,
    dailySavings: 12.50,
    daysWithoutBetting: 15,
    intelligenceScore: 72,
    investmentPotential: { spent: 650.00, tesouro: 780.00, etfs: 945.00 }
};

export default function Dashboard() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [financialData, setFinancialData] = useState<DashboardData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false); // Estado para erro/retry

  /**
   * Função para buscar dados do Firebase.
   * Utiliza a função do serviço que já tem o retry embutido.
   */
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    const userId = await AsyncStorage.getItem('userId');
    
    if (!userId) { 
        setFinancialData(initialData);
        setIsLoading(false);
        return;
    }
    
    try {
        // Chamada ao Firebase com tratamento de interrupção (retry)
        const data = await Impulses.fetchDashboardData(userId); 
        setFinancialData(data as DashboardData);
    } catch (error: any) {
        // Se todas as tentativas falharem, define o estado de erro
        Alert.alert('Erro de Conexão', `Não foi possível carregar o Dashboard: ${error.message}`);
        setFinancialData(initialData);
        setHasError(true); 
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleImpulseRegistered = () => {
    fetchDashboardData(); // Recarrega os dados após o sucesso do registro
  };

  // 1. Renderização condicional para o estado de carregamento
  if (isLoading) {
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={{ marginTop: 10, color: '#666' }}>Carregando seu progresso...</Text>
        </View>
    );
  }

  // 2. Renderização para estado de erro (Tratamento de interrupção com Tentar Novamente)
  if (hasError) {
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.errorFeedbackText}>Falha ao carregar dados.</Text>
            <Text style={styles.errorSubtext}>Verifique sua conexão de internet e tente novamente.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchDashboardData}>
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
          <Text style={styles.greeting}>Boa tarde, {financialData.userName}! 👋</Text>
          <Text style={styles.subtitle}>Você está transformando impulsos em oportunidades</Text>
        </View>

        {/* Money Saved Card */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.moneyCard}
        >
          <View style={styles.moneyCardContent}>
            <PiggyBank size={32} color="#FFFFFF" />
            <Text style={styles.moneyTitle}>Dinheiro Poupado</Text>
            <Text style={styles.moneyAmount}>R${financialData.moneySaved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.moneySubtitle}>
              Economia de apostas convertida em potencial!
            </Text>
            
            <View style={styles.moneyStats}>
              <View style={styles.moneyStat}>
                <Text style={styles.moneyStatValue}>R${financialData.dailySavings.toFixed(2)}</Text>
                <Text style={styles.moneyStatLabel}>Média Diária</Text>
              </View>
              <View style={styles.moneyStat}>
                <Text style={styles.moneyStatValue}>{financialData.daysWithoutBetting} dias</Text>
                <Text style={styles.moneyStatLabel}>Sem Apostar</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Financial Intelligence Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <BarChart3 size={24} color="#667eea" />
            <Text style={styles.scoreTitle}>Inteligência Financeira</Text>
          </View>
          
          <View style={styles.scoreContent}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>{financialData.intelligenceScore}%</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreDescription}>
                Sua pontuação melhorou 15% neste mês!
              </Text>
              <Text style={styles.scoreLevel}>Nível: Em progresso</Text>
            </View>
          </View>
        </View>

        {/* Investment Potential */}
        <View style={styles.potentialCard}>
          <Text style={styles.potentialTitle}>Potencial de Investimento</Text>
          <Text style={styles.potentialSubtitle}>
            Quanto seu dinheiro já valeria se investido:
          </Text>
          
          <View style={styles.investmentOptions}>
            <View style={styles.investmentOption}>
              <View style={[styles.investmentDot, { backgroundColor: '#ff6b6b' }]} />
              <Text style={styles.investmentLabel}>Apostas Gastas</Text>
              <Text style={styles.investmentValue}>-R${financialData.investmentPotential.spent.toFixed(0)}</Text>
            </View>
            <View style={styles.investmentOption}>
              <View style={[styles.investmentDot, { backgroundColor: '#51cf66' }]} />
              <Text style={styles.investmentLabel}>Investimento Tesouro</Text>
              <Text style={styles.investmentValue}>+R${financialData.investmentPotential.tesouro.toFixed(0)}</Text>
            </View>
            <View style={styles.investmentOption}>
              <View style={[styles.investmentDot, { backgroundColor: '#4ecdc4' }]} />
              <Text style={styles.investmentLabel}>ETFs/Ações</Text>
              <Text style={styles.investmentValue}>+R${financialData.investmentPotential.etfs.toFixed(0)}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Ações Rápidas</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dangerButton]}
              onPress={() => setShowBetModal(true)}
            >
              <AlertTriangle size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Registrar Impulso</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
              <TrendingUp size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Simular Investimento</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Target size={24} color="#667eea" />
              <Text style={[styles.actionButtonText, { color: '#667eea' }]}>Criar Objetivo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Clock size={24} color="#667eea" />
              <Text style={[styles.actionButtonText, { color: '#667eea' }]}>Ver Histórico</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tip of the Day */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Dica do Dia</Text>
          <Text style={styles.tipText}>
            Quando sentir vontade de apostar, respire fundo e
            visualize como esse dinheiro cresceria investido. Cada
            pequena escolha constrói um futuro mais próspero!
          </Text>
        </View>
      </ScrollView>

      <BetRegistrationModal
        visible={showBetModal}
        onClose={() => setShowBetModal(false)}
        onRegistered={handleImpulseRegistered}
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  moneyCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
  },
  moneyCardContent: {
    alignItems: 'center',
  },
  moneyTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  moneyAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  moneySubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
  },
  moneyStats: {
    flexDirection: 'row',
    gap: 40,
  },
  moneyStat: {
    alignItems: 'center',
  },
  moneyStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  moneyStatLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scoreLevel: {
    fontSize: 12,
    color: '#51cf66',
    fontWeight: '500',
  },
  potentialCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  potentialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  potentialSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  investmentOptions: {
    gap: 12,
  },
  investmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  investmentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  investmentLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  investmentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  dangerButton: {
    backgroundColor: '#ff6b6b',
  },
  primaryButton: {
    backgroundColor: '#4ecdc4',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tipCard: {
    backgroundColor: '#fff3cd',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  // NOVOS ESTILOS PARA TRATAMENTO DE ERRO/RETRY
  errorFeedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
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
