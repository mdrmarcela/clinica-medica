function renderSecretarias() {
    const secretarias = ClinicApp.get('secretarias');

    document.getElementById('secretarias-count').textContent =
        ClinicApp.countText(secretarias.length);

    document.getElementById('lista-secretarias').innerHTML =
        ClinicApp.table(
            [
                {
                    key: 'nome',
                    label: 'Nome'
                },
                {
                    key: 'email',
                    label: 'E-mail'
                }
            ],
            secretarias,
            {
                edit: 'editarSecretaria',
                remove: 'excluirSecretaria'
            }
        );
}


function editarSecretaria(id) {
    const secretarias = ClinicApp.get('secretarias');

    const secretaria = secretarias.find(
        item => item.id === id
    );

    if (!secretaria) {
        ClinicApp.toast(
            'Secretária não encontrada.',
            'error'
        );
        return;
    }

    document.getElementById('secretaria-id').value =
        secretaria.id;

    document.getElementById('secretaria-nome').value =
        secretaria.nome;

    document.getElementById('secretaria-email').value =
        secretaria.email;

    document.getElementById('secretaria-form-title').textContent =
        'Editar secretária';

    document.getElementById('salvar-secretaria').textContent =
        'Salvar alterações';

    document.getElementById('cancelar-secretaria')
        .classList.remove('hidden');
}


function limparSecretaria() {
    document.getElementById('form-secretaria').reset();

    document.getElementById('secretaria-id').value = '';

    document.getElementById('secretaria-form-title').textContent =
        'Nova secretária';

    document.getElementById('salvar-secretaria').textContent =
        'Cadastrar';

    document.getElementById('cancelar-secretaria')
        .classList.add('hidden');
}


function emailValido(email) {
    const regexEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regexEmail.test(email);
}


function emailSecretariaDuplicado(email, idAtual = '') {
    const secretarias = ClinicApp.get('secretarias');

    return secretarias.some(secretaria =>
        secretaria.email.toLowerCase() === email.toLowerCase() &&
        secretaria.id !== idAtual
    );
}


function excluirSecretaria(id) {
    if (!ClinicApp.confirm('Excluir esta secretária?')) {
        return;
    }

    const secretarias =
        ClinicApp.get('secretarias');

    const secretariasAtualizadas =
        secretarias.filter(
            secretaria => secretaria.id !== id
        );

    ClinicApp.set(
        'secretarias',
        secretariasAtualizadas
    );

    renderSecretarias();

    ClinicApp.toast(
        'Secretária excluída.'
    );
}


function salvarSecretaria(event) {
    event.preventDefault();

    const id =
        document.getElementById('secretaria-id').value;

    const nome =
        document.getElementById('secretaria-nome')
            .value
            .trim();

    const email =
        document.getElementById('secretaria-email')
            .value
            .trim()
            .toLowerCase();

    if (!nome) {
        ClinicApp.toast(
            'Informe o nome da secretária.',
            'error'
        );
        return;
    }

    if (!email) {
        ClinicApp.toast(
            'Informe o e-mail da secretária.',
            'error'
        );
        return;
    }

    if (nome.length < 3) {
        ClinicApp.toast(
            'O nome deve ter pelo menos 3 caracteres.',
            'error'
        );
        return;
    }

    if (!emailValido(email)) {
        ClinicApp.toast(
            'Informe um e-mail válido.',
            'error'
        );
        return;
    }

    if (emailSecretariaDuplicado(email, id)) {
        ClinicApp.toast(
            'Já existe uma secretária cadastrada com este e-mail.',
            'error'
        );
        return;
    }

    let secretarias =
        ClinicApp.get('secretarias');

    if (id) {
        secretarias =
            secretarias.map(secretaria =>
                secretaria.id === id
                    ? {
                        ...secretaria,
                        nome,
                        email
                    }
                    : secretaria
            );
    } else {
        const novaSecretaria = {
            id: ClinicApp.uid(),
            nome,
            email
        };

        secretarias.push(
            novaSecretaria
        );
    }

    ClinicApp.set(
        'secretarias',
        secretarias
    );

    renderSecretarias();

    limparSecretaria();

    ClinicApp.toast(
        id
            ? 'Secretária atualizada.'
            : 'Secretária cadastrada.'
    );
}


document.addEventListener(
    'DOMContentLoaded',
    () => {

        renderSecretarias();

        document
            .getElementById('cancelar-secretaria')
            .addEventListener(
                'click',
                limparSecretaria
            );

        document
            .getElementById('form-secretaria')
            .addEventListener(
                'submit',
                salvarSecretaria
            );
    }
);