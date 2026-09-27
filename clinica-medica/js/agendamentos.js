function renderAgendamentoSelects() {
  const pacienteSelecionado =
    document.getElementById("agendamento-paciente")?.value || "";

  const medicoSelecionado =
    document.getElementById("agendamento-medico")?.value || "";

  const salaSelecionada =
    document.getElementById("agendamento-sala")?.value || "";

  const pacientes = ClinicApp.get("pacientes");
  const medicos = ClinicApp.get("medicos");
  const salas = ClinicApp.get("salas");

  ClinicApp.fillSelect(
    "agendamento-paciente",
    pacientes,
    (paciente) => paciente.nome,
    "Selecione um paciente",
    pacienteSelecionado,
  );

  ClinicApp.fillSelect(
    "agendamento-medico",
    medicos,
    (medico) => medico.nome,
    "Selecione um médico",
    medicoSelecionado,
  );

  ClinicApp.fillSelect(
    "agendamento-sala",
    salas,
    (sala) => `${sala.nome} (${sala.sigla})`,
    "Selecione uma sala",
    salaSelecionada,
  );
}

function renderAgendamentos() {
  const pacientes = ClinicApp.get("pacientes");
  const medicos = ClinicApp.get("medicos");
  const salas = ClinicApp.get("salas");
  const especialidades = ClinicApp.get("especialidades");

  const agendamentos = ClinicApp.get("agendamentos")
    .slice()
    .sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`));

  const dadosFormatados = agendamentos.map((agendamento) => {
    const paciente = pacientes.find(
      (item) => item.id === agendamento.pacienteId,
    );

    const medico = medicos.find((item) => item.id === agendamento.medicoId);

    const sala = salas.find((item) => item.id === agendamento.salaId);

    const especialidade = especialidades.find(
      (item) => item.id === medico?.especialidadeId,
    );

    return {
      ...agendamento,

      pacienteNome: paciente?.nome || "—",

      medicoNome: medico?.nome || "—",

      especialidadeNome: especialidade?.nome || "—",

      salaNome: sala ? `${sala.nome} (${sala.sigla})` : "—",

      dataFormatada: formatarData(agendamento.data),
    };
  });

  document.getElementById("agendamentos-count").textContent =
    ClinicApp.countText(dadosFormatados.length);

  document.getElementById("lista-agendamentos").innerHTML = ClinicApp.table(
    [
      {
        key: "dataFormatada",
        label: "Data",
      },
      {
        key: "hora",
        label: "Horário",
      },
      {
        key: "pacienteNome",
        label: "Paciente",
      },
      {
        key: "medicoNome",
        label: "Médico",
      },
      {
        key: "especialidadeNome",
        label: "Especialidade",
      },
      {
        key: "salaNome",
        label: "Sala",
      },
    ],
    dadosFormatados,
    {
      edit: "editarAgendamento",
      remove: "excluirAgendamento",
    },
  );

  renderAgendamentoSelects();

  ClinicApp.refreshDashboard();
}

function formatarData(data) {
  if (!data) {
    return "—";
  }

  const dataObjeto = new Date(`${data}T12:00:00`);

  return dataObjeto.toLocaleDateString("pt-BR");
}

function mostrarMensagemAgendamento(texto, tipo = "error") {
  const mensagem = document.getElementById("mensagem-agendamento");

  mensagem.textContent = texto;
  mensagem.className = `message ${tipo}`;
}

function limparMensagemAgendamento() {
  const mensagem = document.getElementById("mensagem-agendamento");

  mensagem.textContent = "";
  mensagem.className = "message hidden";
}

function editarAgendamento(id) {
  const agendamentos = ClinicApp.get("agendamentos");

  const agendamento = agendamentos.find((item) => item.id === id);

  if (!agendamento) {
    ClinicApp.toast("Consulta não encontrada.", "error");
    return;
  }

  renderAgendamentoSelects();

  document.getElementById("agendamento-id").value = agendamento.id;

  document.getElementById("agendamento-paciente").value =
    agendamento.pacienteId;

  document.getElementById("agendamento-medico").value = agendamento.medicoId;

  document.getElementById("agendamento-sala").value = agendamento.salaId;

  document.getElementById("agendamento-data").value = agendamento.data;

  document.getElementById("agendamento-hora").value = agendamento.hora;

  document.getElementById("agendamento-form-title").textContent =
    "Editar consulta";

  document.getElementById("salvar-agendamento").textContent =
    "Salvar alterações";

  document.getElementById("cancelar-agendamento").classList.remove("hidden");

  limparMensagemAgendamento();
}

function limparAgendamento() {
  document.getElementById("form-agendamento").reset();

  document.getElementById("agendamento-id").value = "";

  document.getElementById("agendamento-form-title").textContent =
    "Nova consulta";

  document.getElementById("salvar-agendamento").textContent =
    "Agendar consulta";

  document.getElementById("cancelar-agendamento").classList.add("hidden");

  limparMensagemAgendamento();

  renderAgendamentoSelects();
}

function dataEhPassada(data) {
  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);

  const dataConsulta = new Date(`${data}T00:00:00`);

  return dataConsulta < hoje;
}

function diaSemanaValido(data) {
  const dataConsulta = new Date(`${data}T12:00:00`);

  const diaSemana = dataConsulta.getDay();

  return diaSemana >= 1 && diaSemana <= 5;
}

function horarioClinicaValido(hora) {
  return hora >= "08:00" && hora < "18:00";
}

function medicoAtendeNoDia(medico, data) {
  const dataConsulta = new Date(`${data}T12:00:00`);

  const diaSemana = dataConsulta.getDay();

  return medico.diasAtendimento?.includes(diaSemana);
}

function medicoAtendeNoHorario(medico, hora) {
  if (!medico.horaInicio || !medico.horaFim) {
    return false;
  }

  return hora >= medico.horaInicio && hora < medico.horaFim;
}

function medicoOcupado(medicoId, data, hora, idAtual = "") {
  const agendamentos = ClinicApp.get("agendamentos");

  return agendamentos.some(
    (agendamento) =>
      agendamento.id !== idAtual &&
      agendamento.medicoId === medicoId &&
      agendamento.data === data &&
      agendamento.hora === hora,
  );
}

function salaOcupada(salaId, data, hora, idAtual = "") {
  const agendamentos = ClinicApp.get("agendamentos");

  return agendamentos.some(
    (agendamento) =>
      agendamento.id !== idAtual &&
      agendamento.salaId === salaId &&
      agendamento.data === data &&
      agendamento.hora === hora,
  );
}

function pacienteOcupado(pacienteId, data, hora, idAtual = "") {
  const agendamentos = ClinicApp.get("agendamentos");

  return agendamentos.some(
    (agendamento) =>
      agendamento.id !== idAtual &&
      agendamento.pacienteId === pacienteId &&
      agendamento.data === data &&
      agendamento.hora === hora,
  );
}

function excluirAgendamento(id) {
  if (!ClinicApp.confirm("Cancelar e excluir esta consulta?")) {
    return;
  }

  const agendamentos = ClinicApp.get("agendamentos");

  const agendamentosAtualizados = agendamentos.filter(
    (agendamento) => agendamento.id !== id,
  );

  ClinicApp.set("agendamentos", agendamentosAtualizados);

  renderAgendamentos();

  ClinicApp.toast("Consulta removida.");
}

function salvarAgendamento(event) {
  event.preventDefault();

  limparMensagemAgendamento();

  const id = document.getElementById("agendamento-id").value;

  const pacienteId = document.getElementById("agendamento-paciente").value;

  const medicoId = document.getElementById("agendamento-medico").value;

  const salaId = document.getElementById("agendamento-sala").value;

  const data = document.getElementById("agendamento-data").value;

  const hora = document.getElementById("agendamento-hora").value;

  if (!pacienteId || !medicoId || !salaId || !data || !hora) {
    mostrarMensagemAgendamento("Preencha todos os campos.");
    return;
  }

  if (dataEhPassada(data)) {
    mostrarMensagemAgendamento(
      "Não é possível agendar uma consulta em uma data passada.",
    );
    return;
  }

  if (!diaSemanaValido(data)) {
    mostrarMensagemAgendamento(
      "A clínica atende somente de segunda a sexta-feira.",
    );
    return;
  }

  if (!horarioClinicaValido(hora)) {
    mostrarMensagemAgendamento(
      "A clínica realiza atendimentos entre 08:00 e 18:00.",
    );
    return;
  }

  const medicos = ClinicApp.get("medicos");

  const medico = medicos.find((item) => item.id === medicoId);

  if (!medico) {
    mostrarMensagemAgendamento("Médico não encontrado.");
    return;
  }

  if (!medicoAtendeNoDia(medico, data)) {
    mostrarMensagemAgendamento(
      "O médico selecionado não atende neste dia da semana.",
    );
    return;
  }

  if (!medicoAtendeNoHorario(medico, hora)) {
    mostrarMensagemAgendamento(
      `O médico atende das ${medico.horaInicio} às ${medico.horaFim}.`,
    );
    return;
  }

  if (medicoOcupado(medicoId, data, hora, id)) {
    mostrarMensagemAgendamento(
      "O médico já possui uma consulta neste horário.",
    );
    return;
  }

  if (salaOcupada(salaId, data, hora, id)) {
    mostrarMensagemAgendamento(
      "A sala selecionada já está ocupada neste horário.",
    );
    return;
  }

  if (pacienteOcupado(pacienteId, data, hora, id)) {
    mostrarMensagemAgendamento(
      "O paciente já possui uma consulta neste horário.",
    );
    return;
  }

  let agendamentos = ClinicApp.get("agendamentos");

  const novoAgendamento = {
    id: id || ClinicApp.uid(),
    pacienteId,
    medicoId,
    salaId,
    data,
    hora,
  };

  if (id) {
    agendamentos = agendamentos.map((agendamento) =>
      agendamento.id === id ? novoAgendamento : agendamento,
    );
  } else {
    agendamentos.push(novoAgendamento);
  }

  ClinicApp.set("agendamentos", agendamentos);

  renderAgendamentos();

  limparAgendamento();

  ClinicApp.toast(id ? "Consulta atualizada." : "Consulta agendada.");
}

document.addEventListener("DOMContentLoaded", () => {
  renderAgendamentos();

  document
    .getElementById("cancelar-agendamento")
    .addEventListener("click", limparAgendamento);

  document
    .getElementById("form-agendamento")
    .addEventListener("submit", salvarAgendamento);
});
