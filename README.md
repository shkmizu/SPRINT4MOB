# **ReVeste – Plataforma de Bem-Estar Financeiro**

### **Integrantes do Grupo**
* **Vitor Shimizu – RM550390** 
* **Fabrizio Maia - RM551869**
* **Victor Asfur - RM551684**
* **João Pedro Marques – RM98307**
* **André Sóler – RM98827**

## **Introdução**

O ReVeste é um aplicativo mobile desenvolvido em React Native (Expo Router) focado em auxiliar usuários a superarem hábitos de apostas, redirecionando seus gastos para investimentos mais inteligentes. O projeto foi atualizado com um backend robusto para gestão de dados em tempo real.

## **Arquitetura de Dados (CRUD)**

Este projeto agora utiliza **Firebase** (Authentication e Cloud Firestore) como backend para um CRUD completo nas funcionalidades centrais:

* **Backend:** Google Firebase (Authentication e Firestore).  
* **Modelo de Dados:** Dados do usuário, Impulsos (apostas registradas) e Objetivos Financeiros (Goals).  
* **Resiliência:** Requisições de leitura (Dashboard e Objetivos) implementam um mecanismo de **Retry com Backoff Exponencial** para garantir a recuperação de dados em caso de falhas temporárias de rede, atendendo ao requisito de tratamento de interrupções.

### **1\. Funcionalidades CRUD Implementadas**

| Tela | Operação | Dados Gerenciados | Detalhes |
| :---- | :---- | :---- | :---- |
| **Login** | Autenticação | Usuários | Usa Firebase Auth. Credenciais inválidas (e-mail/senha) retornam feedback claro. |
| **Dashboard** | READ | Consolidados | Leitura resiliente de dados (Retry) com cálculo de métricas (Economia, Potencial de Investimento). |
| **Modal Impulso** | CREATE | Impulsos | Registro de novas tentativas de aposta no Firestore, convertendo o valor em "economia". |
| **Objetivos** | CRUD | Metas Financeiras | Listagem (READ) resiliente. Possibilidade de Criar, Editar e Excluir metas (CREATE, UPDATE, DELETE). |
| **Configurações** | DELETE | Usuário & Dados | Exclusão completa e irreversível da conta e de todos os dados do usuário no Firestore. |

### **2\. Credenciais de Acesso (Firebase Auth)**

Para acessar a aplicação, o usuário de teste deve ser criado **no Console do Firebase Authentication** com as seguintes credenciais:

| Campo | Valor |
| :---- | :---- |
| **E-mail** | fiap2025@reveste.app |
| **Senha** | sprintmobile |

### **3\. Pré-requisitos**

* Node.js (LTS recomendado)  
* npm ou Yarn  
* Expo Go app (para testar em dispositivo móvel)  
* Conta Firebase configurada (credenciais em services/firebase.ts)

### **4\. Instalação e Execução**

Para rodar o projeto localmente, siga os passos abaixo:

1. **Instale as dependências (incluindo Firebase):**  
   npm install  
   \# ou  
   yarn install

2. **Instale módulos nativos do Expo:**  
   npx install-expo-modules@latest

3. **Inicie o aplicativo (limpando o cache após alterações de módulos):**  
   npm run dev  
   \# ou  
   npx expo start \--clear

   Escaneie o QR code com o aplicativo Expo Go ou use um simulador.

## **Tecnologias Utilizadas**

* **React Native** – Framework para desenvolvimento mobile.  
* **Expo Router** – Para navegação e estrutura de arquivos.  
* **Firebase** – Authentication e Cloud Firestore para backend e CRUD.  
* **AsyncStorage** – Armazenamento local.  
* **Lucide React Native** – Para ícones.  
* **Expo** – Desenvolvimento e build.