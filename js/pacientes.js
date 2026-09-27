function renderPacientes() {
    const convenios = ClinicApp.get('convenios');
    const pacientes = ClinicApp.get('pacientes');

    const pacientesFormatados =
        pacientes.map(paciente => {

            const convenio =
                convenios.find(
                    item => item.id === paciente.convenioId
                );

            return {
                ...paciente,
                convenioNome:
                    convenio
                        ? convenio.nome
                        : 'Particular'
            };
        });

    document.getElementById('pacientes-count').textContent =
        ClinicApp.countText(pacientesFormatados.length);

    document.getElementById('lista-pacientes').innerHTML =
        ClinicApp.table(
            [
                {
                    key: 'nome',
                    label: 'Nome'
                },
                {
                    key: 'cpf',
                    label: 'CPF'
                },
                {
                    key: 'telefone',
                    label: 'Telefone'
                },
                {
                    key: 'convenioNome',
                    label: 'Convênio'
                }
            ],
            pacientesFormatados,
            {
                edit: 'editarPaciente',
                remove: 'excluirPaciente'
            }
        );

    ClinicApp.refreshAllSelects();
}


function editarPaciente(id) {
    const pacientes =
        ClinicApp.get('pacientes');

    const paciente =
        pacientes.find(
            item => item.id === id
        );

    if (!paciente) {
        ClinicApp.toast(
            'Paciente não encontrado.',
            'error'
        );
        return;
    }

    document.getElementById('paciente-id').value =
        paciente.id;

    document.getElementById('paciente-nome').value =
        paciente.nome;

    document.getElementById('paciente-cpf').value =
        paciente.cpf;

    document.getElementById('paciente-telefone').value =
        paciente.telefone;

    renderConvenioSelects();

    document.getElementById('paciente-convenio').value =
        paciente.convenioId || '';

    document.getElementById('paciente-form-title').textContent =
        'Editar paciente';

    document.getElementById('salvar-paciente').textContent =
        'Salvar alterações';

    document.getElementById('cancelar-paciente')
        .classList.remove('hidden');
}


function limparPaciente() {
    document.getElementById('form-paciente').reset();

    document.getElementById('paciente-id').value = '';

    document.getElementById('paciente-form-title').textContent =
        'Novo paciente';

    document.getElementById('salvar-paciente').textContent =
        'Cadastrar';

    document.getElementById('cancelar-paciente')
        .classList.add('hidden');

    renderConvenioSelects();
}


function limparNumeros(valor) {
    return valor.replace(/\D/g, '');
}


function cpfValido(cpf) {
    const numeros =
        limparNumeros(cpf);

    return numeros.length === 11;
}


function telefoneValido(telefone) {
    const numeros =
        limparNumeros(telefone);

    return numeros.length === 10 ||
           numeros.length === 11;
}


function cpfDuplicado(cpf, idAtual = '') {
    const pacientes =
        ClinicApp.get('pacientes');

    const cpfNormalizado =
        limparNumeros(cpf);

    return pacientes.some(paciente =>
        limparNumeros(paciente.cpf) === cpfNormalizado &&
        paciente.id !== idAtual
    );
}


function pacientePossuiAgendamento(idPaciente) {
    const agendamentos =
        ClinicApp.get('agendamentos');

    return agendamentos.some(
        agendamento =>
            agendamento.pacienteId === idPaciente
    );
}


function excluirPaciente(id) {
    if (pacientePossuiAgendamento(id)) {
        ClinicApp.toast(
            'O paciente possui consulta agendada e não pode ser excluído.',
            'error'
        );
        return;
    }

    if (!ClinicApp.confirm('Excluir este paciente?')) {
        return;
    }

    const pacientes =
        ClinicApp.get('pacientes');

    const pacientesAtualizados =
        pacientes.filter(
            paciente => paciente.id !== id
        );

    ClinicApp.set(
        'pacientes',
        pacientesAtualizados
    );

    renderPacientes();

    ClinicApp.toast(
        'Paciente excluído.'
    );
}


function salvarPaciente(event) {
    event.preventDefault();

    const id =
        document.getElementById('paciente-id').value;

    const nome =
        document.getElementById('paciente-nome')
            .value
            .trim();

    const cpf =
        document.getElementById('paciente-cpf')
            .value
            .trim();

    const telefone =
        document.getElementById('paciente-telefone')
            .value
            .trim();

    const convenioId =
        document.getElementById('paciente-convenio')
            .value;

    if (!nome) {
        ClinicApp.toast(
            'Informe o nome do paciente.',
            'error'
        );
        return;
    }

    if (!cpf) {
        ClinicApp.toast(
            'Informe o CPF do paciente.',
            'error'
        );
        return;
    }

    if (!telefone) {
        ClinicApp.toast(
            'Informe o telefone do paciente.',
            'error'
        );
        return;
    }

    if (nome.length < 3) {
        ClinicApp.toast(
            'O nome do paciente deve ter pelo menos 3 caracteres.',
            'error'
        );
        return;
    }

    if (!cpfValido(cpf)) {
        ClinicApp.toast(
            'O CPF deve possuir 11 dígitos.',
            'error'
        );
        return;
    }

    if (!telefoneValido(telefone)) {
        ClinicApp.toast(
            'Informe um telefone válido com DDD.',
            'error'
        );
        return;
    }

    if (cpfDuplicado(cpf, id)) {
        ClinicApp.toast(
            'Já existe um paciente cadastrado com este CPF.',
            'error'
        );
        return;
    }

    let pacientes =
        ClinicApp.get('pacientes');

    if (id) {
        pacientes =
            pacientes.map(paciente =>
                paciente.id === id
                    ? {
                        ...paciente,
                        nome,
                        cpf,
                        telefone,
                        convenioId
                    }
                    : paciente
            );
    } else {
        const novoPaciente = {
            id: ClinicApp.uid(),
            nome,
            cpf,
            telefone,
            convenioId
        };

        pacientes.push(
            novoPaciente
        );
    }

    ClinicApp.set(
        'pacientes',
        pacientes
    );

    renderPacientes();

    limparPaciente();

    ClinicApp.toast(
        id
            ? 'Paciente atualizado.'
            : 'Paciente cadastrado.'
    );
}


document.addEventListener(
    'DOMContentLoaded',
    () => {

        renderPacientes();

        document
            .getElementById('cancelar-paciente')
            .addEventListener(
                'click',
                limparPaciente
            );

        document
            .getElementById('form-paciente')
            .addEventListener(
                'submit',
                salvarPaciente
            );
    }
);