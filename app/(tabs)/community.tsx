import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Users, MessageCircle, Heart, Share, Plus } from 'lucide-react-native';

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed');

  const posts = [
    {
      id: 1,
      author: 'Maria S.',
      timeAgo: '2h',
      content: 'Hoje completo 30 dias sem apostar! 🎉 A sensação é incrível. Em vez de R$ 450 que gastaria apostando, estou focada no meu objetivo de reserva de emergência.',
      likes: 24,
      comments: 8,
      badge: 'VIP'
    },
    {
      id: 2,
      author: 'João P.',
      timeAgo: '5h',
      content: 'Alguém tem dicas de como lidar com a ansiedade quando sinto vontade de apostar? Geralmente acontece quando estou entediado em casa.',
      likes: 12,
      comments: 15,
      badge: 'Gold'
    },
    {
      id: 3,
      author: 'Ana L.',
      timeAgo: '1d',
      content: 'Dica que funcionou para mim: sempre que penso em apostar, abro o simulador de investimentos e vejo quanto aquele dinheiro poderia render. Impressionante!',
      likes: 31,
      comments: 7,
      badge: 'Pro'
    }
  ];

  const supportResources = [
    {
      title: 'Agendar Terapia Financeira',
      description: 'Sessões especializadas em comportamento financeiro',
      action: 'Agendar',
    },
    {
      title: 'Grupo de Apoio',
      description: 'Encontros semanais online com outros usuários',
      action: 'Participar',
    },
    {
      title: 'Conteúdo Educacional',
      description: 'Artigos e vídeos sobre educação financeira',
      action: 'Acessar',
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Comunidade de Apoio</Text>
        <Text style={styles.subtitle}>Compartilhe sua jornada e inspire os outros</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
            Conversas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
          onPress={() => setActiveTab('resources')}
        >
          <Text style={[styles.tabText, activeTab === 'resources' && styles.activeTabText]}>
            Recursos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
            Apoio
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'feed' && (
          <>
            {/* Share Button */}
            <TouchableOpacity style={styles.shareButton}>
              <Plus size={20} color="#667eea" />
              <Text style={styles.shareButtonText}>Compartilhar</Text>
            </TouchableOpacity>

            {/* Posts */}
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.authorInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{post.author.charAt(0)}</Text>
                    </View>
                    <View>
                      <View style={styles.authorNameRow}>
                        <Text style={styles.authorName}>{post.author}</Text>
                        <View style={[styles.badge, getBadgeStyle(post.badge)]}>
                          <Text style={[styles.badgeText, getBadgeTextStyle(post.badge)]}>
                            {post.badge}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.timeAgo}>{post.timeAgo}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Heart size={16} color="#999" />
                    <Text style={styles.actionText}>{post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={16} color="#999" />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share size={16} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'resources' && (
          <View style={styles.resourcesContainer}>
            {supportResources.map((resource, index) => (
              <View key={index} style={styles.resourceCard}>
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceDescription}>{resource.description}</Text>
                </View>
                <TouchableOpacity style={styles.resourceButton}>
                  <Text style={styles.resourceButtonText}>{resource.action}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'groups' && (
          <View style={styles.groupsContainer}>
            <View style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Users size={24} color="#667eea" />
                <Text style={styles.groupTitle}>Grupo de Apoio Semanal</Text>
              </View>
              <Text style={styles.groupDescription}>
                Encontros toda quinta-feira às 19h para compartilhar experiências
                e estratégias de controle de impulsos.
              </Text>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Participar do Próximo Encontro</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.therapistCard}>
              <Text style={styles.therapistTitle}>Terapeutas Especializados</Text>
              <Text style={styles.therapistDescription}>
                Profissionais qualificados em terapia comportamental e
                educação financeira para te ajudar nesta jornada.
              </Text>
              <TouchableOpacity style={styles.scheduleButton}>
                <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.crisisCard}>
              <Text style={styles.crisisTitle}>Em Crise?</Text>
              <Text style={styles.crisisDescription}>
                Se você está sentindo uma forte compulsão para apostar,
                não hesite em buscar ajuda imediata.
              </Text>
              <TouchableOpacity style={styles.emergencyButton}>
                <Text style={styles.emergencyButtonText}>Buscar Ajuda Agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function getBadgeStyle(badge: string) {
  switch (badge) {
    case 'VIP':
      return { backgroundColor: '#667eea' };
    case 'Gold':
      return { backgroundColor: '#ffa726' };
    case 'Pro':
      return { backgroundColor: '#51cf66' };
    default:
      return { backgroundColor: '#999' };
  }
}

function getBadgeTextStyle(badge: string) {
  return { color: '#FFFFFF' };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  postCard: {
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
  postHeader: {
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#999',
  },
  resourcesContainer: {
    gap: 16,
    paddingBottom: 100,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
  },
  resourceButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resourceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  groupsContainer: {
    gap: 20,
    paddingBottom: 100,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  therapistCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    padding: 20,
  },
  therapistTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  therapistDescription: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
    marginBottom: 16,
  },
  scheduleButton: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  crisisCard: {
    backgroundColor: '#ffebee',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#ef5350',
  },
  crisisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#c62828',
    marginBottom: 8,
  },
  crisisDescription: {
    fontSize: 14,
    color: '#c62828',
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#ef5350',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});