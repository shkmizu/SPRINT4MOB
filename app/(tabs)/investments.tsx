import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TrendingUp, ArrowRight, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Investments() {
  const [selectedInvestment, setSelectedInvestment] = useState('tesouro');

  const investments = [
    {
      id: 'tesouro',
      name: 'Renda Fixa',
      description: 'CDB, LCI, LCA e Tesouro Direto. Investimentos seguros com rentabilidade previsível.',
      return: '100%',
      risk: 'Baixo',
      minValue: '100',
      color: '#51cf66',
    },
    {
      id: 'titulos',
      name: 'Títulos Públicos',
      description: 'Tesouro Selic, IPCA+ e Prefixado. O investimento mais seguro do Brasil.',
      return: '95%',
      risk: 'Baixo',
      minValue: '30',
      color: '#4ecdc4',
    },
    {
      id: 'acoes',
      name: 'Ações',
      description: 'Ações de empresas listadas na bolsa de valores. Maior potencial de retorno.',
      return: '120%',
      risk: 'Alto',
      minValue: '100',
      color: '#667eea',
    },
    {
      id: 'etfs',
      name: 'Fundos de Índice (ETFs)',
      description: 'Diversificação automática seguindo índices do mercado como Ibovespa.',
      return: '110%',
      risk: 'Médio',
      minValue: '50',
      color: '#764ba2',
    },
    {
      id: 'crypto',
      name: 'Criptomoedas',
      description: 'Bitcoin, Ethereum e outras moedas digitais. Alto risco e alta volatilidade.',
      return: '180%',
      risk: 'Muito Alto',
      minValue: '25',
      color: '#ff6b6b',
    },
  ];

  const simulationData = {
    monthlyAmount: 125, // Amount saved from not betting
    timeframes: [
      { years: 5, amount: 9875 },
      { years: 10, amount: 22450 },
      { years: 15, amount: 38200 },
      { years: 20, amount: 58950 },
    ]
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Simulador de Investimentos</Text>
          <Text style={styles.subtitle}>
            Veja como seu dinheiro pode crescer ao invés de ser perdido em apostas
          </Text>
        </View>

        {/* Current Saving Info */}
        <View style={styles.savingCard}>
          <View style={styles.savingContent}>
            <Text style={styles.savingTitle}>Seus Dados Atuais</Text>
            <Text style={styles.savingDescription}>
              Baseado no que você economizou não apostando:
            </Text>
            <Text style={styles.savingAmount}>R$125,00/mês</Text>
            <Text style={styles.savingPeriod}>Poupado nos últimos 15 dias</Text>
          </View>
        </View>

        {/* Investment Options */}
        <View style={styles.investmentSection}>
          <Text style={styles.sectionTitle}>Escolha seu Perfil de Investimento</Text>
          <Text style={styles.sectionSubtitle}>
            Selecione o tipo de investimento para ver a simulação:
          </Text>

          {investments.map((investment) => (
            <TouchableOpacity
              key={investment.id}
              style={[
                styles.investmentCard,
                selectedInvestment === investment.id && styles.investmentCardSelected
              ]}
              onPress={() => setSelectedInvestment(investment.id)}
            >
              <View style={styles.investmentHeader}>
                <View style={[styles.investmentDot, { backgroundColor: investment.color }]} />
                <View style={styles.investmentInfo}>
                  <Text style={styles.investmentName}>{investment.name}</Text>
                  <Text style={styles.investmentDescription}>{investment.description}</Text>
                </View>
                <ArrowRight size={20} color={selectedInvestment === investment.id ? investment.color : '#999'} />
              </View>
              
              <View style={styles.investmentStats}>
                <View style={styles.investmentStat}>
                  <Text style={styles.investmentStatLabel}>Retorno</Text>
                  <Text style={[styles.investmentStatValue, { color: investment.color }]}>
                    {investment.return}
                  </Text>
                </View>
                <View style={styles.investmentStat}>
                  <Text style={styles.investmentStatLabel}>Risco</Text>
                  <Text style={styles.investmentStatValue}>{investment.risk}</Text>
                </View>
                <View style={styles.investmentStat}>
                  <Text style={styles.investmentStatLabel}>Mín</Text>
                  <Text style={styles.investmentStatValue}>R${investment.minValue}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Simulation Results */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.simulationCard}
        >
          <View style={styles.simulationContent}>
            <TrendingUp size={32} color="#FFFFFF" />
            <Text style={styles.simulationTitle}>Projeção de Crescimento</Text>
            <Text style={styles.simulationSubtitle}>
              Com R$125/mês investidos em {investments.find(i => i.id === selectedInvestment)?.name}:
            </Text>
            
            <View style={styles.timeframeContainer}>
              {simulationData.timeframes.map((timeframe) => (
                <View key={timeframe.years} style={styles.timeframeItem}>
                  <Text style={styles.timeframeYears}>{timeframe.years} anos</Text>
                  <Text style={styles.timeframeAmount}>
                    R${timeframe.amount.toLocaleString('pt-BR')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* Comparison */}
        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>Lembre-se:</Text>
          
          <View style={styles.comparisonItem}>
            <View style={[styles.comparisonDot, { backgroundColor: '#ff6b6b' }]} />
            <View style={styles.comparisonInfo}>
              <Text style={styles.comparisonLabel}>Dinheiro Apostado</Text>
              <Text style={styles.comparisonDescription}>
                R$125 perdidos a cada mês = R$0 no futuro
              </Text>
            </View>
          </View>
          
          <View style={styles.comparisonItem}>
            <View style={[styles.comparisonDot, { backgroundColor: '#51cf66' }]} />
            <View style={styles.comparisonInfo}>
              <Text style={styles.comparisonLabel}>Dinheiro Investido</Text>
              <Text style={styles.comparisonDescription}>
                R$125 mensais = R$58.950 em 20 anos
              </Text>
            </View>
          </View>
        </View>

        {/* Educational Note */}
        <View style={styles.educationalCard}>
          <Info size={20} color="#ffa726" />
          <View style={styles.educationalContent}>
            <Text style={styles.educationalTitle}>Nota Educativa</Text>
            <Text style={styles.educationalText}>
              Rentabilidades passadas não garantem resultados futuros. Este é apenas um simulador educativo baseado em médias históricas do mercado brasileiro.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Começar a Investir Agora</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  savingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  savingContent: {
    alignItems: 'center',
  },
  savingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  savingDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  savingAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#51cf66',
    marginBottom: 4,
  },
  savingPeriod: {
    fontSize: 12,
    color: '#999',
  },
  investmentSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  investmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  investmentCardSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f8f9ff',
  },
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  investmentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  investmentDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  investmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  investmentStat: {
    alignItems: 'center',
  },
  investmentStatLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
  },
  investmentStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  simulationCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  simulationContent: {
    alignItems: 'center',
  },
  simulationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  simulationSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 24,
  },
  timeframeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  timeframeItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    minWidth: '45%',
  },
  timeframeYears: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timeframeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  comparisonCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  comparisonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  comparisonDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  comparisonInfo: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  comparisonDescription: {
    fontSize: 12,
    color: '#666',
  },
  educationalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff8e1',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  educationalContent: {
    flex: 1,
  },
  educationalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f57c00',
    marginBottom: 4,
  },
  educationalText: {
    fontSize: 12,
    color: '#f57c00',
    lineHeight: 16,
  },
  startButton: {
    backgroundColor: '#51cf66',
    marginHorizontal: 24,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 100,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});