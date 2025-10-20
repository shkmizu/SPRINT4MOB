# **ReVeste – Plataforma de Bem-Estar Financeiro**

### **Integrantes do Grupo**
* **Vitor Shimizu – RM550390** 
* **Fabrizio Maia - RM551869**
* **Victor Asfur - RM551684**
* **João Pedro Marques – RM98307**
* **André Sóler – RM98827**

## **Introdução**

O ReVeste é um aplicativo mobile desenvolvido em React Native (Expo Router) focado em auxiliar usuários a superarem hábitos de apostas, redirecionando seus gastos para investimentos mais inteligentes. O projeto foi atualizado com um backend robusto para gestão de dados em tempo real, utilizando a arquitetura Firebase.

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

## **Prints para demonstação**

<img width="1916" height="1044" alt="homescreen" src="https://github.com/user-attachments/assets/f723cf0d-23a4-46d3-abc9-886824ecfbf0" />

<img width="1918" height="1041" alt="goalscreen" src="https://github.com/user-attachments/assets/586904d6-459d-4e45-865b-2b0b3e4ef405" />

<img width="1685" height="1030" alt="image" src="https://github.com/user-attachments/assets/5438c0e6-3761-4fff-b05c-93262c8943e3" />

<img width="1680" height="1028" alt="image" src="https://github.com/user-attachments/assets/5795da19-e69f-4b77-8fb2-8d459d3877e8" />

<img width="1342" height="708" alt="image" src="https://github.com/user-attachments/assets/e8efd6b2-15ff-4613-ad21-8532c58f8e27" />

## **Tecnologias Utilizadas**

* **React Native** – Framework para desenvolvimento mobile.  
* **Expo Router** – Para navegação e estrutura de arquivos.  
* **Firebase** – Authentication e Cloud Firestore para backend e CRUD.  
* **AsyncStorage** – Armazenamento local.  
* **Lucide React Native** – Para ícones.  
* **Expo** – Desenvolvimento e build.
