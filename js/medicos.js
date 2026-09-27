function renderMedicos() {
    const especialidades = ClinicApp.get('especialidades');
    const medicos = ClinicApp.get('medicos');

    const medicosFormatados =
        medicos.map(medico => {

            const especialidade =
                especialidades.find(
                    item => item.id === medico.especialidadeId
                );

            return {
                ...medico,

                especialidadeNome:
                    especialidade
                        ? especialidade.nome
                        : '—',

                diasAtendimentoTexto:
                    formatarDiasAtendimento(
                        medico.diasAtendimento
                    ),

                horarioTexto:
                    medico.horaInicio && medico.horaFim
                        ? `${medico.horaInicio} às ${medico.horaFim}`
                        : '—'
            };
        });

    document.getElementById('medicos-count').textContent =
        ClinicApp.countText(medicosFormatados.length);

    document.getElementById('lista-medicos').innerHTML =
        ClinicApp.table(
            [
                {
                    key: 'nome',
                    label: 'Nome'
                },
                {
                    key: 'crm',
                    label: 'CRM'
                },
                {
                    key: 'especialidadeNome',
                    label: 'Especialidade'
                },
                {
                    key: 'diasAtendimentoTexto',
                    label: 'Dias'
                },
                {
                    key: 'horarioTexto',
                    label: 'Horário'
                }
            ],
            medicosFormatados,
            {
                edit: 'editarMedico',
                remove: 'excluirMedico'
            }
        );

    ClinicApp.refreshAllSelects();
}


function formatarDiasAtendimento(dias) {
    if (!dias || dias.length === 0) {
        return '—';
    }

    const nomesDias = {
        1: 'Seg',
        2: 'Ter',
        3: 'Qua',
        4: 'Qui',
        5: 'Sex'
    };

    return dias
        .map(dia => nomesDias[dia])
        .join(', ');
}


function obterDiasSelecionados() {
    const checkboxes =
        document.querySelectorAll(
            'input[name="dias-medico"]:checked'
        );

    return Array.from(checkboxes)
        .map(input => Number(input.value));
}


function marcarDiasAtendimento(dias = []) {
    const checkboxes =
        document.querySelectorAll(
            'input[name="dias-medico"]'
        );

    checkboxes.forEach(input => {
        input.checked =
            dias.includes(
                Number(input.value)
            );
    });
}


function editarMedico(id) {
    const medicos =
        ClinicApp.get('medicos');

    const medico =
        medicos.find(
            item => item.id === id
        );

    if (!medico) {
        ClinicApp.toast(
            'Médico não encontrado.',
            'error'
        );
        return;
    }

    document.getElementById('medico-id').value =
        medico.id;

    document.getElementById('medico-nome').value =
        medico.nome;

    document.getElementById('medico-crm').value =
        medico.crm;

    renderEspecialidadeSelects();

    document.getElementById('medico-especialidade').value =
        medico.especialidadeId;

    document.getElementById('medico-hora-inicio').value =
        medico.horaInicio || '';

    document.getElementById('medico-hora-fim').value =
        medico.horaFim || '';

    marcarDiasAtendimento(
        medico.diasAtendimento || []
    );

    document.getElementById('medico-form-title').textContent =
        'Editar médico';

    document.getElementById('salvar-medico').textContent =
        'Salvar alterações';

    document.getElementById('cancelar-medico')
        .classList.remove('hidden');
}


function limparMedico() {
    document.getElementById('form-medico').reset();

    document.getElementById('medico-id').value = '';

    document.getElementById('medico-form-title').textContent =
        'Novo médico';

    document.getElementById('salvar-medico').textContent =
        'Cadastrar';

    document.getElementById('cancelar-medico')
        .classList.add('hidden');

    marcarDiasAtendimento([]);

    renderEspecialidadeSelects();
}


function crmDuplicado(crm, idAtual = '') {
    const medicos =
        ClinicApp.get('medicos');

    return medicos.some(medico =>
        medico.crm.toLowerCase() === crm.toLowerCase() &&
        medico.id !== idAtual
    );
}


function medicoPossuiAgendamento(idMedico) {
    const agendamentos =
        ClinicApp.get('agendamentos');

    return agendamentos.some(
        agendamento =>
            agendamento.medicoId === idMedico
    );
}


function horarioMedicoValido(horaInicio, horaFim) {
    if (!horaInicio || !horaFim) {
        return false;
    }

    return horaInicio < horaFim;
}


function excluirMedico(id) {
    if (medicoPossuiAgendamento(id)) {
        ClinicApp.toast(
            'O médico possui consulta agendada e não pode ser excluído.',
            'error'
        );
        return;
    }

    if (!ClinicApp.confirm('Excluir este médico?')) {
        return;
    }

    const medicos =
        ClinicApp.get('medicos');

    const medicosAtualizados =
        medicos.filter(
            medico => medico.id !== id
        );

    ClinicApp.set(
        'medicos',
        medicosAtualizados
    );

    renderMedicos();

    ClinicApp.toast(
        'Médico excluído.'
    );
}


function salvarMedico(event) {
    event.preventDefault();

    const id =
        document.getElementById('medico-id').value;

    const nome =
        document.getElementById('medico-nome')
            .value
            .trim();

    const crm =
        document.getElementById('medico-crm')
            .value
            .trim();

    const especialidadeId =
        document.getElementById('medico-especialidade')
            .value;

    const horaInicio =
        document.getElementById('medico-hora-inicio')
            .value;

    const horaFim =
        document.getElementById('medico-hora-fim')
            .value;

    const diasAtendimento =
        obterDiasSelecionados();

    if (!nome) {
        ClinicApp.toast(
            'Informe o nome do médico.',
            'error'
        );
        return;
    }

    if (!crm) {
        ClinicApp.toast(
            'Informe o CRM do médico.',
            'error'
        );
        return;
    }

    if (!especialidadeId) {
        ClinicApp.toast(
            'Selecione uma especialidade.',
            'error'
        );
        return;
    }

    if (nome.length < 3) {
        ClinicApp.toast(
            'O nome do médico deve ter pelo menos 3 caracteres.',
            'error'
        );
        return;
    }

    if (crmDuplicado(crm, id)) {
        ClinicApp.toast(
            'Já existe um médico cadastrado com este CRM.',
            'error'
        );
        return;
    }

    if (diasAtendimento.length === 0) {
        ClinicApp.toast(
            'Selecione pelo menos um dia de atendimento.',
            'error'
        );
        return;
    }

    if (!horarioMedicoValido(horaInicio, horaFim)) {
        ClinicApp.toast(
            'Informe um horário de atendimento válido.',
            'error'
        );
        return;
    }

    let medicos =
        ClinicApp.get('medicos');

    const dadosMedico = {
        id: id || ClinicApp.uid(),
        nome,
        crm,
        especialidadeId,
        diasAtendimento,
        horaInicio,
        horaFim
    };

    if (id) {
        medicos =
            medicos.map(medico =>
                medico.id === id
                    ? dadosMedico
                    : medico
            );
    } else {
        medicos.push(
            dadosMedico
        );
    }

    ClinicApp.set(
        'medicos',
        medicos
    );

    renderMedicos();

    limparMedico();

    ClinicApp.toast(
        id
            ? 'Médico atualizado.'
            : 'Médico cadastrado.'
    );
}


document.addEventListener(
    'DOMContentLoaded',
    () => {

        renderMedicos();

        document
            .getElementById('cancelar-medico')
            .addEventListener(
                'click',
                limparMedico
            );

        document
            .getElementById('form-medico')
            .addEventListener(
                'submit',
                salvarMedico
            );
    }
);