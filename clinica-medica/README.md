# Clínica Médica — Oficina Scrum

Projeto educacional desenvolvido para uma oficina prática de Scrum com estudantes de Ciência da Computação.

O sistema simula o gerenciamento básico de uma clínica médica, permitindo o cadastro de pacientes, médicos, salas, convênios, especialidades, secretárias e o agendamento de consultas.

A proposta é utilizar o projeto como base para uma atividade prática de desenvolvimento de software, em que os participantes trabalharão em diferentes funcionalidades durante uma Sprint.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- `localStorage` para armazenamento local dos dados

Não é necessário instalar banco de dados, Node.js ou servidor.

## Como executar

1. Faça o download ou clone este repositório.
2. Abra a pasta do projeto.
3. Execute o arquivo `index.html` em um navegador moderno.

Também é possível utilizar a extensão **Live Server** no VS Code.

Os dados cadastrados são armazenados no `localStorage` do navegador utilizado.

## Estrutura do projeto

```text
clinica-medica/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── secretarias.js
│   ├── salas.js
│   ├── convenios.js
│   ├── pacientes.js
│   ├── medicos.js
│   ├── especialidades.js
│   └── agendamentos.js
└── README.md
```

## Funcionalidades

### Secretárias
- Cadastro de secretárias
- Edição de dados
- Exclusão de registros
- Validação de e-mail
- Verificação de e-mail duplicado

### Salas
- Cadastro de salas
- Edição e exclusão
- Nome e sigla identificadora
- Validação de sigla duplicada
- Bloqueio de exclusão quando a sala possui consulta agendada

### Convênios
- Cadastro de convênios
- Edição e exclusão
- Código identificador
- Validação de nome e código duplicados
- Bloqueio de exclusão quando existem pacientes vinculados

### Pacientes
- Cadastro de pacientes
- CPF
- Telefone
- Associação opcional com convênio
- Validação de CPF duplicado
- Validação básica de CPF e telefone
- Bloqueio de exclusão quando existem consultas agendadas

### Especialidades
- Cadastro de especialidades médicas
- Edição e exclusão
- Validação de especialidade duplicada
- Bloqueio de exclusão quando existem médicos vinculados

### Médicos
- Cadastro de médicos
- CRM
- Associação com especialidade
- Definição dos dias de atendimento
- Definição do horário de início e fim do atendimento
- Validação de CRM duplicado
- Bloqueio de exclusão quando existem consultas agendadas

### Agendamentos
- Cadastro de consultas
- Edição e cancelamento
- Associação entre paciente, médico e sala
- Validação da data da consulta
- Atendimento apenas de segunda a sexta-feira
- Horário de funcionamento da clínica entre 08h e 18h
- Validação dos dias de atendimento do médico
- Validação do horário de atendimento do médico
- Bloqueio de conflito de horário do médico
- Bloqueio de conflito de horário da sala
- Bloqueio de conflito de horário do paciente

## Painel inicial

O sistema possui uma tela inicial com:

- quantidade de pacientes cadastrados;
- quantidade de médicos;
- quantidade de salas;
- quantidade de consultas;
- resumo dos próximos atendimentos;
- atalhos para os principais cadastros.

## Armazenamento dos dados

Os dados são armazenados utilizando o `localStorage` do navegador.

Isso significa que:

- os dados permanecem disponíveis após fechar e abrir a página;
- os dados ficam armazenados apenas no navegador utilizado;
- não existe banco de dados externo;
- limpar os dados do navegador pode apagar os registros cadastrados.

## Objetivo educacional

Este projeto foi desenvolvido como apoio para uma oficina prática de Scrum.

Durante a atividade, os participantes trabalharão sobre o mesmo produto e serão divididos em grupos responsáveis por diferentes funcionalidades do sistema.

O objetivo é permitir a aplicação prática de conceitos como:

- levantamento de requisitos;
- Product Backlog;
- Sprint Planning;
- desenvolvimento em equipe;
- Daily Scrum;
- Sprint Review;
- retrospectiva.

## Versão da oficina

Este repositório contém a versão completa e funcional do sistema.

Para a realização da oficina será preparada uma segunda versão, contendo trechos específicos do código removidos ou incompletos.

Cada grupo ficará responsável por implementar uma funcionalidade ou regra de negócio durante a Sprint.

## Contexto do sistema

A clínica médica realiza consultas previamente agendadas e possui médicos de diferentes especialidades.

Cada médico possui dias e horários específicos de atendimento, e cada consulta utiliza uma sala em uma determinada data e horário.

O sistema busca auxiliar na organização dos agendamentos e evitar conflitos entre médicos, pacientes e salas.

## Projeto educacional

Projeto desenvolvido para atividade acadêmica e oficina prática de Scrum no IFSC.
