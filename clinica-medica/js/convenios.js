function renderConvenioSelects() {
    const selectConvenio = document.getElementById('paciente-convenio');

    if (!selectConvenio) {
        return;
    }

    const convenioSelecionado = selectConvenio.value;
    const convenios = ClinicApp.get('convenios');

    ClinicApp.fillSelect(
        'paciente-convenio',
        convenios,
        convenio => convenio.nome,
        'Sem convênio',
        convenioSelecionado
    );
}


function renderConvenios() {
    const convenios = ClinicApp.get('convenios');

    document.getElementById('convenios-count').textContent =
        ClinicApp.countText(convenios.length);

    document.getElementById('lista-convenios').innerHTML =
        ClinicApp.table(
            [
                {
                    key: 'nome',
                    label: 'Nome'
                },
                {
                    key: 'codigo',
                    label: 'Código'
                }
            ],
            convenios,
            {
                edit: 'editarConvenio',
                remove: 'excluirConvenio'
            }
        );

    renderConvenioSelects();
}


function editarConvenio(id) {
    const convenios = ClinicApp.get('convenios');

    const convenio = convenios.find(
        item => item.id === id
    );

    if (!convenio) {
        ClinicApp.toast(
            'Convênio não encontrado.',
            'error'
        );
        return;
    }

    document.getElementById('convenio-id').value =
        convenio.id;

    document.getElementById('convenio-nome').value =
        convenio.nome;

    document.getElementById('convenio-codigo').value =
        convenio.codigo;

    document.getElementById('convenio-form-title').textContent =
        'Editar convênio';

    document.getElementById('salvar-convenio').textContent =
        'Salvar alterações';

    document.getElementById('cancelar-convenio')
        .classList.remove('hidden');
}


function limparConvenio() {
    document.getElementById('form-convenio').reset();

    document.getElementById('convenio-id').value = '';

    document.getElementById('convenio-form-title').textContent =
        'Novo convênio';

    document.getElementById('salvar-convenio').textContent =
        'Cadastrar';

    document.getElementById('cancelar-convenio')
        .classList.add('hidden');
}


function codigoConvenioDuplicado(codigo, idAtual = '') {
    const convenios = ClinicApp.get('convenios');

    return convenios.some(convenio =>
        convenio.codigo.toLowerCase() === codigo.toLowerCase() &&
        convenio.id !== idAtual
    );
}


function nomeConvenioDuplicado(nome, idAtual = '') {
    const convenios = ClinicApp.get('convenios');

    return convenios.some(convenio =>
        convenio.nome.toLowerCase() === nome.toLowerCase() &&
        convenio.id !== idAtual
    );
}


function possuiPacienteVinculado(idConvenio) {
    const pacientes = ClinicApp.get('pacientes');

    return pacientes.some(
        paciente => paciente.convenioId === idConvenio
    );
}


function excluirConvenio(id) {
    if (possuiPacienteVinculado(id)) {
        ClinicApp.toast(
            'Não é possível excluir: existem pacientes vinculados a este convênio.',
            'error'
        );
        return;
    }

    if (!ClinicApp.confirm('Excluir este convênio?')) {
        return;
    }

    const convenios = ClinicApp.get('convenios');

    const conveniosAtualizados =
        convenios.filter(
            convenio => convenio.id !== id
        );

    ClinicApp.set(
        'convenios',
        conveniosAtualizados
    );

    renderConvenios();

    ClinicApp.toast(
        'Convênio excluído.'
    );
}


function salvarConvenio(event) {
    event.preventDefault();

    const id =
        document.getElementById('convenio-id').value;

    const nome =
        document.getElementById('convenio-nome')
            .value
            .trim();

    const codigo =
        document.getElementById('convenio-codigo')
            .value
            .trim()
            .toUpperCase();

    if (!nome) {
        ClinicApp.toast(
            'Informe o nome do convênio.',
            'error'
        );
        return;
    }

    if (!codigo) {
        ClinicApp.toast(
            'Informe o código do convênio.',
            'error'
        );
        return;
    }

    if (nome.length < 3) {
        ClinicApp.toast(
            'O nome do convênio deve ter pelo menos 3 caracteres.',
            'error'
        );
        return;
    }

    if (codigo.length < 2) {
        ClinicApp.toast(
            'O código do convênio deve ter pelo menos 2 caracteres.',
            'error'
        );
        return;
    }

    if (nomeConvenioDuplicado(nome, id)) {
        ClinicApp.toast(
            'Já existe um convênio com este nome.',
            'error'
        );
        return;
    }

    if (codigoConvenioDuplicado(codigo, id)) {
        ClinicApp.toast(
            'Já existe um convênio com este código.',
            'error'
        );
        return;
    }

    let convenios =
        ClinicApp.get('convenios');

    if (id) {
        convenios =
            convenios.map(convenio =>
                convenio.id === id
                    ? {
                        ...convenio,
                        nome,
                        codigo
                    }
                    : convenio
            );
    } else {
        const novoConvenio = {
            id: ClinicApp.uid(),
            nome,
            codigo
        };

        convenios.push(
            novoConvenio
        );
    }

    ClinicApp.set(
        'convenios',
        convenios
    );

    renderConvenios();

    limparConvenio();

    ClinicApp.toast(
        id
            ? 'Convênio atualizado.'
            : 'Convênio cadastrado.'
    );
}


document.addEventListener(
    'DOMContentLoaded',
    () => {

        renderConvenios();

        document
            .getElementById('cancelar-convenio')
            .addEventListener(
                'click',
                limparConvenio
            );

        document
            .getElementById('form-convenio')
            .addEventListener(
                'submit',
                salvarConvenio
            );
    }
);