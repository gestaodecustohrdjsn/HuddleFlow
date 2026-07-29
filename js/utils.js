window.Huddle = window.Huddle || {};

Huddle.Utils = {
  $(id) {
    return document.getElementById(id);
  },

  id(prefixo = "ID") {
    const data = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);

    const aleatorio = Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();

    return `${prefixo}-${data}-${aleatorio}`;
  },

  agoraISO() {
    return new Date().toISOString();
  },

  dataBR(data = new Date()) {
    return new Intl.DateTimeFormat("pt-BR").format(data);
  },

  horaBR(data = new Date()) {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(data);
  },

  dataHoraBR(valor) {
    if (!valor) return "";

    const data = new Date(valor);

    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(data);
  },

  dataInputLocal(data = new Date()) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  },

  dataInputHoje() {
    return this.dataInputLocal(new Date());
  },

  dataInputMaxPrazo(anos = 5) {
    const data = new Date();
    data.setFullYear(data.getFullYear() + anos);

    return this.dataInputLocal(data);
  },

  validarDataPrazo(dataInformada, nomeCampo = "data final") {
    if (!dataInformada) {
      this.toast(`Informe a ${nomeCampo}.`);
      return null;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataInformada)) {
      this.toast(`Informe uma ${nomeCampo} válida.`);
      return null;
    }

    const dataInicio = new Date(`${dataInformada}T00:00:00`);
    const dataFim = new Date(`${dataInformada}T23:59:59`);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const maximo = new Date(hoje);
    maximo.setFullYear(maximo.getFullYear() + 5);

    if (Number.isNaN(dataInicio.getTime())) {
      this.toast(`Informe uma ${nomeCampo} válida.`);
      return null;
    }

    if (dataInicio < hoje) {
      this.toast("A data final não pode ser anterior à data de hoje.");
      return null;
    }

    if (dataInicio > maximo) {
      this.toast("A data final não pode ultrapassar 5 anos a partir de hoje.");
      return null;
    }

    return dataFim;
  },

  escapeHtml(valor) {
    return String(valor ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  },

  formatarNomeProprio(valor) {
    return String(valor ?? "")
      .toLocaleLowerCase("pt-BR")
      .replace(/(^|\s)(\S)/g, (trecho, espaco, letra) => {
        return espaco + letra.toLocaleUpperCase("pt-BR");
      });
  },

  toast(mensagem, tempo = 2800) {
    const toast = document.getElementById("toast");

    toast.textContent = mensagem;
    toast.classList.remove("hidden");

    clearTimeout(this._toastTimer);

    this._toastTimer = setTimeout(() => {
      toast.classList.add("hidden");
    }, tempo);
  }
};
