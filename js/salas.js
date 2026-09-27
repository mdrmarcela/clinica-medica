function renderSalas() {
    const salas = ClinicApp.get('salas');

    document.getElementById('salas-count').textContent =
        ClinicApp.countText(salas.length);

    document.getElementById('lista-salas').innerHTML =
        ClinicApp.table(
            [
                {
                    key: 'nome',
                    label: 'Nome'
                },
                {
                    key: 'sigla',
                    label: 'Sigla'
                }
            ],
            salas,
            {
                edit: 'editarSala',
                remove: 'excluirSala'
            }
        );

    ClinicApp.refreshAllSelects();
}


function editarSala(id) {
    const salas = ClinicApp.get('salas');

    const sala = salas.find(
        item => item.id === id
    );

    if (!sala) {
        ClinicApp.toast(
            'Sala não encontrada.',
            'error'
        );
        return;
    }

    document.getElementById('sala-id').value =
        sala.id;

    document.getElementById('sala-nome').value =
        sala.nome;

    document.getElementById('sala-sigla').value =
        sala.sigla;

    document.getElementById('sala-form-title').textContent =
        'Editar sala';

    document.getElementById('salvar-sala').textContent =
        'Salvar alterações';

    document.getElementById('cancelar-sala')
        .classList.remove('hidden');
}


function limparSala() {
    document.getElementById('form-sala').reset();

    document.getElementById('sala-id').value = '';

    document.getElementById('sala-form-title').textContent =
        'Nova sala';

    document.getElementById('salvar-sala').textContent =
        'Cadastrar';

    document.getElementById('cancelar-sala')
        .classList.add('hidden');
}


function nomeSalaDuplicado(nome, idAtual = '') {
    const salas = ClinicApp.get('salas');

    return salas.some(sala =>
        sala.nome.toLowerCase() === nome.toLowerCase() &&
        sala.id !== idAtual
    );
}


function siglaSalaDuplicada(sigla, idAtual = '') {
    const salas = ClinicApp.get('salas');

    return salas.some(sala =>
        sala.sigla.toLowerCase() === sigla.toLowerCase() &&
        sala.id !== idAtual
    );
}


function salaPossuiAgendamento(idSala) {
    const agendamentos = ClinicApp.get('agendamentos');

    return agendamentos.some(
        agendamento => agendamento.salaId === idSala
    );
}


function excluirSala(id) {
    if (salaPossuiAgendamento(id)) {
        ClinicApp.toast(
            'A sala possui consulta agendada e não pode ser excluída.',
            'error'
        );
        return;
    }

    if (!ClinicApp.confirm('Excluir esta sala?')) {
        return;
    }

    const salas = ClinicApp.get('salas');

    const salasAtualizadas =
        salas.filter(
            sala => sala.id !== id
        );

    ClinicApp.set(
        'salas',
        salasAtualizadas
    );

    renderSalas();

    ClinicApp.toast(
        'Sala excluída.'
    );
}


function salvarSala(event) {
    event.preventDefault();

    const id =
        document.getElementById('sala-id').value;

    const nome =
        document.getElementById('sala-nome')
            .value
            .trim();

    const sigla =
        document.getElementById('sala-sigla')
            .value
            .trim()
            .toUpperCase();

    if (!nome) {
        ClinicApp.toast(
            'Informe o nome da sala.',
            'error'
        );
        return;
    }

    if (!sigla) {
        ClinicApp.toast(
            'Informe a sigla da sala.',
            'error'
        );
        return;
    }

    if (nome.length < 3) {
        ClinicApp.toast(
            'O nome da sala deve ter pelo menos 3 caracteres.',
            'error'
        );
        return;
    }

    if (sigla.length > 5) {
        ClinicApp.toast(
            'A sigla deve ter no máximo 5 caracteres.',
            'error'
        );
        return;
    }

    if (nomeSalaDuplicado(nome, id)) {
        ClinicApp.toast(
            'Já existe uma sala com este nome.',
            'error'
        );
        return;
    }

    if (siglaSalaDuplicada(sigla, id)) {
        ClinicApp.toast(
            'Já existe uma sala com esta sigla.',
            'error'
        );
        return;
    }

    let salas =
        ClinicApp.get('salas');

    if (id) {
        salas =
            salas.map(sala =>
                sala.id === id
                    ? {
                        ...sala,
                        nome,
                        sigla
                    }
                    : sala
            );
    } else {
        const novaSala = {
            id: ClinicApp.uid(),
            nome,
            sigla
        };

        salas.push(
            novaSala
        );
    }

    ClinicApp.set(
        'salas',
        salas
    );

    renderSalas();

    limparSala();

    ClinicApp.toast(
        id
            ? 'Sala atualizada.'
            : 'Sala cadastrada.'
    );
}


document.addEventListener(
    'DOMContentLoaded',
    () => {

        renderSalas();

        document
            .getElementById('cancelar-sala')
            .addEventListener(
                'click',
                limparSala
            );

        document
            .getElementById('form-sala')
            .addEventListener(
                'submit',
                salvarSala
            );
    }
);