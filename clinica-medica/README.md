# Clínica Médica — Oficina Scrum

Projeto educacional para uma oficina prática de Scrum.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- `localStorage` do navegador para persistência local

Não é necessário instalar banco de dados, Node.js ou servidor.

## Como executar

1. Extraia a pasta do projeto.
2. Abra o arquivo `index.html` em um navegador moderno.
3. Os dados cadastrados ficam salvos no navegador utilizado.

## Estrutura

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

- Cadastro, edição, listagem e exclusão de secretárias
- Cadastro, edição, listagem e exclusão de salas
- Cadastro, edição, listagem e exclusão de convênios
- Cadastro, edição, listagem e exclusão de pacientes
- Cadastro, edição, listagem e exclusão de médicos
- Cadastro, edição, listagem e exclusão de especialidades
- Cadastro, edição, listagem e exclusão de consultas
- Validação de conflito de médico ou sala no mesmo horário
- Relacionamento entre paciente e convênio
- Relacionamento entre médico e especialidade
- Painel inicial com indicadores e resumo da agenda

## Observação para a oficina

Esta é a versão completa. Depois de validar o funcionamento e a dificuldade de cada módulo, pode ser criada uma segunda versão com trechos selecionados removidos para que os grupos implementem durante a Sprint.
