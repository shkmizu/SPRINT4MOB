import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { User, Bell, Shield, CircleHelp as HelpCircle, FileText, LogOut, ChevronRight, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importação relativa: Caminho corrigido para a pasta raiz
import { Auth, auth } from '../../services/firebase'; 

export default function Settings() {
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              // Desloga do Firebase Auth
              await auth.signOut();
            } catch (e) {
              console.error("Erro ao deslogar do Firebase", e);
            }
            // Limpa o armazenamento local de qualquer forma
            await AsyncStorage.removeItem('isAuthenticated');
            await AsyncStorage.removeItem('userId');
            router.replace('/(auth)/welcome');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação é irreversível. Todos os seus dados serão permanentemente removidos. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const user = auth.currentUser;
            const userId = await AsyncStorage.getItem('userId');

            if (!user || !userId) {
                Alert.alert('Erro', 'Sessão inválida. Por favor, faça login novamente para confirmar a exclusão.');
                await AsyncStorage.clear();
                router.replace('/(auth)/welcome');
                return;
            }

            try {
                // Chamada DELETE para o Firebase (exclui dados e o usuário no Auth)
                await Auth.deleteAccount(user, userId); 

                // Sucesso e navegação para tela de boas-vindas
                Alert.alert('Sucesso', 'Sua conta e todos os seus dados foram excluídos com sucesso.', [{ 
                    text: 'OK', 
                    onPress: () => router.replace('/(auth)/welcome') 
                }]);

            } catch (error: any) {
                // Tratamento de erro robusto
                let errorMessage = 'Falha ao excluir conta. Por favor, tente novamente.';
                if (error.code === 'auth/requires-recent-login') {
                    errorMessage = 'Operação sensível: Por favor, faça logout e login novamente imediatamente para confirmar a exclusão.';
                } else if (error.message) {
                    errorMessage = error.message;
                }

                Alert.alert('Erro na Exclusão', errorMessage);
            }
          }
        }
      ]
    );
  };

  const settingsItems = [
    {
      id: 'profile',
      title: 'Perfil',
      description: 'Editar informações pessoais',
      icon: User,
      onPress: () => {},
    },
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Gerenciar alertas e lembretes',
      icon: Bell,
      onPress: () => {},
    },
    {
      id: 'privacy',
      title: 'Privacidade e Dados',
      description: 'Controle de dados pessoais',
      icon: Shield,
      onPress: () => {},
    },
    {
      id: 'help',
      title: 'Ajuda e Suporte',
      description: 'Dúvidas frequentes e contato',
      icon: HelpCircle,
      onPress: () => {},
    },
    {
      id: 'terms',
      title: 'Termos e Política',
      description: 'Termos de uso e política de privacidade',
      icon: FileText,
      onPress: () => {},
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
          <Text style={styles.subtitle}>Gerencie sua conta e preferências</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>V</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Vitor</Text>
            <Text style={styles.userEmail}>fiap2025@reveste.app</Text>
            <Text style={styles.userStatus}>Membro desde Janeiro 2024</Text>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          {settingsItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.settingItem, item.id === 'terms' && { borderBottomWidth: 0 }]}
                onPress={item.onPress}
              >
                <View style={styles.settingIconContainer}>
                  <IconComponent size={24} color="#667eea" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingDescription}>{item.description}</Text>
                </View>
                <ChevronRight size={20} color="#999" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notification Settings */}
        <View style={styles.notificationSection}>
          <Text style={styles.sectionTitle}>Preferências de Notificação</Text>
          
          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Alertas de Impulso</Text>
              <Text style={styles.notificationDescription}>
                Receba lembretes quando detectarmos padrões de risco
              </Text>
            </View>
            <View style={styles.toggle}>
              <View style={styles.toggleActive} />
            </View>
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Progresso Semanal</Text>
              <Text style={styles.notificationDescription}>
                Resumo dos seus objetivos e conquistas
              </Text>
            </View>
            <View style={styles.toggle}>
              <View style={styles.toggleActive} />
            </View>
          </View>

          <View style={[styles.notificationItem, { borderBottomWidth: 0 }]}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Dicas Educacionais</Text>
              <Text style={styles.notificationDescription}>
                Conteúdo sobre educação financeira e investimentos
              </Text>
            </View>
            <View style={styles.toggleInactive} />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.privacySection}>
          <Text style={styles.sectionTitle}>Privacidade e Dados</Text>
          
          <View style={styles.privacyCard}>
            <Shield size={20} color="#51cf66" />
            <View style={styles.privacyContent}>
              <Text style={styles.privacyTitle}>Seus dados estão seguros</Text>
              <Text style={styles.privacyDescription}>
                Seguimos rigorosamente a LGPD e não compartilhamos suas
                informações pessoais com terceiros.
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.privacyOption}>
            <Text style={styles.privacyOptionText}>Baixar Meus Dados</Text>
            <ChevronRight size={16} color="#667eea" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.privacyOption, { borderBottomWidth: 0 }]}>
            <Text style={styles.privacyOptionText}>Gerenciar Consentimentos</Text>
            <ChevronRight size={16} color="#667eea" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Zona de Perigo</Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#ff6b6b" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Trash2 size={20} color="#ff6b6b" />
            <Text style={styles.deleteButtonText}>Excluir Conta</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>ReVeste v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 ReVeste. Todos os direitos reservados.</Text>
        </View>
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
  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
    color: '#999',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  notificationSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 12,
    color: '#666',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 2,
  },
  toggleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleInactive: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
  },
  privacySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#f0fff4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5016',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 12,
    color: '#2d5016',
    lineHeight: 16,
  },
  privacyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  privacyOptionText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  dangerZone: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 100,
  },
  appInfoText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});