<img width="1920" height="1040" alt="image" src="https://github.com/user-attachments/assets/0a357c3f-3f72-45ee-b303-ce41dbf25c3a" /># ReVeste – Plataforma de Bem-Estar Financeiro

## Introdução

O ReVeste é um aplicativo mobile desenvolvido em React Native que tem como propósito ajudar usuários a superarem hábitos de apostas e redirecionarem seus gastos para investimentos mais inteligentes. Ele une elementos de educação financeira, gamificação e suporte psicológico, oferecendo uma jornada acolhedora e motivadora para o usuário.

### Pré-requisitos

Ao iniciar, o aplicativo apresenta uma tela de login segura implementada com AsyncStorage. O acesso é feito com as credenciais:

```
Usuário: fiap2025

Senha: sprintmobile
```

Erros como senha incorreta ou usuário inválido são tratados de forma clara e amigável. Uma vez logado, o usuário é direcionado para o Dashboard, onde encontra as principais funcionalidades.

### Funcionalidades

O Dashboard apresenta o valor economizado por não apostar, um Índice de Inteligência Financeira gamificado e gráficos que comparam gastos em apostas com potenciais retornos de investimentos.

O usuário pode registrar apostas informando data, valor e tipo, além de marcar recorrências. Também conta com um simulador de investimentos, que mostra projeções de quanto o dinheiro não apostado poderia render em diferentes prazos (5, 10 e 20 anos) e modalidades de investimento como renda fixa, títulos públicos, ações e ETFs.

Outro recurso é o planejamento de metas, que permite criar objetivos financeiros, acompanhar o progresso em tempo real e receber sugestões sobre quanto economizar mensalmente para alcançar cada meta.

O aplicativo envia alertas comportamentais quando identifica padrões de risco, reforça comportamentos positivos e sugere conteúdos educativos. Além disso, há uma comunidade anônima onde os usuários podem compartilhar experiências, e um espaço para agendar consultas com terapeutas financeiros ou psicólogos.

No menu de configurações, é possível gerenciar perfil, notificações, privacidade e exclusão da conta.

## Instalação e Execução

Para rodar o projeto localmente, siga os passos abaixo:

Instale as dependências:

```
npm install
```

```
npx install-expo-modules@latest
```

Inicie o aplicativo:

```
npx expo start
```

## Algumas demonstrações

<img width="1921" height="1039" alt="image" src="https://github.com/user-attachments/assets/5ae3ce52-808f-4f58-86ba-c7e1281d4b54" />

<img width="1918" height="1036" alt="image" src="https://github.com/user-attachments/assets/ca56f540-1974-4b73-aa8f-c3d8a9836de0" />

<img width="1920" height="1040" alt="image" src="https://github.com/user-attachments/assets/b9860713-03d6-49eb-b181-e94c96cf55d9" />

<img width="1919" height="1041" alt="image" src="https://github.com/user-attachments/assets/b5e41b14-7d35-4b43-8aa7-e52a020d29e0" />

<img width="1920" height="1040" alt="image" src="https://github.com/user-attachments/assets/93a58f4a-acca-462a-b10e-ba185a65adde" />

## Tecnologias Utilizadas

* React Native – Framework para desenvolvimento mobile.
* AsyncStorage – Armazenamento local e gerenciamento de sessão.
* React Navigation – Navegação entre telas.
* Expo – Desenvolvimento e build

## Integrantes

* **Vitor Shimizu** - *RM550390*
* **João Pedro Marques** - *RM98307* 
* **André Sóler** - *RM98827* 
* **Fabrizio Maia** - *RM551869* 
* **Victor Asfur** - *RM551684*
