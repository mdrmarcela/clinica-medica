function renderEspecialidadeSelects() {
    const selectMedico = document.getElementById('medico-especialidade');

    if (!selectMedico) {
        return;
    }

    const especialidadeSelecionada = selectMedico.value;
    const especialidades = ClinicApp.get('especialidades');

    ClinicApp.fillSelect(
        'medico-especialidade',
        especialidades,
        especialidade => especialidade.nome,
        'Selecione uma especialidade',
        especialidadeSelecionada
    );
}


function renderEspecialidades() {
    const especialidades = ClinicApp.get('especialidades');

    document.getElementById('especialidades-count').textContent =
        ClinicApp.countText(especialidades.length);

    document.getElementById('lista-especialidades').innerHTML =
        ClinicApp.table(
            [
                {
                    key: 'nome',
                    label: 'Nome'
                }
            ],
            especialidades,
            {
                edit: 'editarEspecialidade',
                remove: 'excluirEspecialidade'
            }
        );

    renderEspecialidadeSelects();
}


function editarEspecialidade(id) {
    const especialidades = ClinicApp.get('especialidades');

    const especialidade = especialidades.find(
        item => item.id === id
    );

    if (!especialidade) {
        ClinicApp.toast(
            'Especialidade não encontrada.',
            'error'
        );
        return;
    }

    document.getElementById('especialidade-id').value =
        especialidade.id;

    document.getElementById('especialidade-nome').value =
        especialidade.nome;

    document.getElementById('especialidade-form-title').textContent =
        'Editar especialidade';

    document.getElementById('salvar-especialidade').textContent =
        'Salvar alterações';

    document.getElementById('cancelar-especialidade')
        .classList.remove('hidden');
}


function limparEspecialidade() {
    document.getElementById('form-especialidade').reset();

    document.getElementById('especialidade-id').value = '';

    document.getElementById('especialidade-form-title').textContent =
        'Nova especialidade';

    document.getElementById('salvar-especialidade').textContent =
        'Cadastrar';

    document.getElementById('cancelar-especialidade')
        .classList.add('hidden');
}


function especialidadeDuplicada(nome, idAtual = '') {
    const especialidades = ClinicApp.get('especialidades');

    return especialidades.some(especialidade =>
        especialidade.nome.toLowerCase() === nome.toLowerCase() &&
        especialidade.id !== idAtual
    );
}


function possuiMedicoVinculado(idEspecialidade) {
    const medicos = ClinicApp.get('medicos');

    return medicos.some(
        medico => medico.especialidadeId === idEspecialidade
    );
}


function excluirEspecialidade(id) {
    if (possuiMedicoVinculado(id)) {
        ClinicApp.toast(
            'Não é possível excluir: existem médicos vinculados a esta especialidade.',
            'error'
        );
        return;
    }

    if (!ClinicApp.confirm('Excluir esta especialidade?')) {
        return;
    }

    const especialidades = ClinicApp.get('especialidades');

    const especialidadesAtualizadas =
        especialidades.filter(
            especialidade => especialidade.id !== id
        );

    ClinicApp.set(
        'especialidades',
        especialidadesAtualizadas
    );

    renderEspecialidades();

    ClinicApp.toast(
        'Especialidade excluída.'
    );
}


function salvarEspecialidade(event) {
    event.preventDefault();

    const id =
        document.getElementById('especialidade-id').value;

    const nome =
        document.getElementById('especialidade-nome')
            .value
            .trim();

    if (!nome) {
        ClinicApp.toast(
            'Informe o nome da especialidade.',
            'error'
        );
        return;
    }

    if (nome.length < 3) {
        ClinicApp.toast(
            'O nome da especialidade deve ter pelo menos 3 caracteres.',
            'error'
        );
        return;
    }

    if (especialidadeDuplicada(nome, id)) {
        ClinicApp.toast(
            'Esta especialidade já está cadastrada.',
            'error'
        );
        return;
    }

    let especialidades =
        ClinicApp.get('especialidades');

    if (id) {
        especialidades =
            especialidades.map(especialidade =>
                especialidade.id === id
                    ? {
                        ...especialidade,
                        nome
                    }
                    : especialidade
            );
    } else {
        const novaEspecialidade = {
            id: ClinicApp.uid(),
            nome
        };

        especialidades.push(
            novaEspecialidade
        );
    }

    ClinicApp.set(
        'especialidades',
        especialidades
    );

    renderEspecialidades();

    limparEspecialidade();

    ClinicApp.toast(
        id
            ? 'Especialidade atualizada.'
            : 'Especialidade cadastrada.'
    );
}


document.addEventListener(
    'DOMContentLoaded',
    () => {

        renderEspecialidades();

        document
            .getElementById('cancelar-especialidade')
            .addEventListener(
                'click',
                limparEspecialidade
            );

        document
            .getElementById('form-especialidade')
            .addEventListener(
                'submit',
                salvarEspecialidade
            );
    }
);