window.Huddle = window.Huddle || {};

Huddle.DB = {
  nome: "huddleflow_local",
  versao: 1,
  db: null,

  storesSistema() {
    return [
      "meta",
      "setores",
      "perguntas",
      "opcoes_pergunta",
      "reunioes",
      "reuniao_setores",
      "respostas",
      "pendencias",
      "pendencia_logs",
      "logs"
    ];
  },

  abrir() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.nome, this.versao);

      request.onupgradeneeded = event => {
        const db = event.target.result;
        this.criarStores(db);
      };

      request.onsuccess = event => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = event => {
        reject(event.target.error);
      };
    });
  },

  criarStores(db) {
    const stores = this.storesSistema();

    stores.forEach(nomeStore => {
      if (!db.objectStoreNames.contains(nomeStore)) {
        const store = db.createObjectStore(nomeStore, {
          keyPath: "id"
        });

        if (nomeStore === "reunioes") {
          store.createIndex("status", "status", { unique: false });
        }

        if (nomeStore === "reuniao_setores") {
          store.createIndex("id_reuniao", "id_reuniao", { unique: false });
          store.createIndex("id_setor", "id_setor", { unique: false });
        }

        if (nomeStore === "perguntas") {
          store.createIndex("id_setor", "id_setor", { unique: false });
        }

        if (nomeStore === "respostas") {
          store.createIndex("id_reuniao", "id_reuniao", { unique: false });
          store.createIndex("id_setor", "id_setor", { unique: false });
          store.createIndex("id_pergunta", "id_pergunta", { unique: false });
        }

        if (nomeStore === "pendencias") {
          store.createIndex("status", "status", { unique: false });
          store.createIndex("id_setor", "id_setor", { unique: false });
          store.createIndex("id_reuniao_origem", "id_reuniao_origem", { unique: false });
        }

        if (nomeStore === "logs") {
          store.createIndex("id_reuniao", "id_reuniao", { unique: false });
        }
      }
    });
  },

  transacao(nomeStore, modo = "readonly") {
    return this.db
      .transaction(nomeStore, modo)
      .objectStore(nomeStore);
  },

  getAll(nomeStore) {
    return new Promise((resolve, reject) => {
      const store = this.transacao(nomeStore);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  get(nomeStore, id) {
    return new Promise((resolve, reject) => {
      const store = this.transacao(nomeStore);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },

  put(nomeStore, objeto) {
    return new Promise((resolve, reject) => {
      const store = this.transacao(nomeStore, "readwrite");
      const request = store.put(objeto);

      request.onsuccess = () => resolve(objeto);
      request.onerror = () => reject(request.error);
    });
  },

  add(nomeStore, objeto) {
    return this.put(nomeStore, objeto);
  },

  delete(nomeStore, id) {
    return new Promise((resolve, reject) => {
      const store = this.transacao(nomeStore, "readwrite");
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  },

  clear(nomeStore) {
    return new Promise((resolve, reject) => {
      const store = this.transacao(nomeStore, "readwrite");
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  },

  async exportarBackup() {
    const dados = {};

    for (const store of this.storesSistema()) {
      dados[store] = await this.getAll(store);
    }

    return {
      nome: "HuddleFlow",
      versao_banco: this.versao,
      exportado_em: Huddle.Utils.agoraISO(),
      dados
    };
  },

  async importarBackup(backup) {
    if (!backup || !backup.dados || typeof backup.dados !== "object") {
      throw new Error("Arquivo de backup inválido.");
    }

    const stores = this.storesSistema();
    const resumo = {};

    for (const store of stores) {
      await this.clear(store);
      resumo[store] = 0;
    }

    for (const store of stores) {
      const registros = Array.isArray(backup.dados[store]) ? backup.dados[store] : [];

      for (const registro of registros) {
        const normalizado = this.normalizarRegistroImportado(store, registro);

        if (normalizado) {
          await this.put(store, normalizado);
          resumo[store] += 1;
        }
      }
    }

    return {
      sucesso: true,
      resumo
    };
  },

  normalizarRegistroImportado(store, registro) {
    if (!registro || typeof registro !== "object") return null;

    const item = { ...registro };

    const idsAlternativos = {
      meta: ["id"],
      setores: ["id", "id_setor"],
      perguntas: ["id", "id_pergunta"],
      opcoes_pergunta: ["id", "id_opcao", "id_opcao_pergunta"],
      reunioes: ["id", "id_reuniao", "id_sessao"],
      reuniao_setores: ["id", "id_reuniao_setor", "id_presenca"],
      respostas: ["id", "id_resposta"],
      pendencias: ["id", "id_pendencia"],
      pendencia_logs: ["id", "id_log", "id_historico"],
      logs: ["id", "id_log"]
    };

    const alternativas = idsAlternativos[store] || ["id"];

    if (!item.id) {
      const campoId = alternativas.find(campo => item[campo]);
      if (campoId) item.id = item[campoId];
    }

    if (!item.id) return null;

    if (store === "pendencias") {
      if (!item.id_reuniao_origem && item.id_reuniao) {
        item.id_reuniao_origem = item.id_reuniao;
      }

      if (!item.status) {
        item.status = item.resolvida ? "Resolvida" : "Aberta";
      }

      if (item.removida === undefined) {
        item.removida = item.status === "Removida";
      }

      if (!item.created_at && item.data_abertura) {
        item.created_at = this.dataHoraBackupParaISO(item.data_abertura, item.hora_abertura);
      }

      if (!item.updated_at) {
        item.updated_at = item.created_at || Huddle.Utils.agoraISO();
      }
    }

    if (store === "respostas") {
      if (!item.created_at) item.created_at = Huddle.Utils.agoraISO();
      if (!item.updated_at) item.updated_at = item.created_at;
    }

    if (store === "reunioes") {
      if (!item.created_at && item.data) {
        item.created_at = this.dataHoraBackupParaISO(item.data, item.hora_inicio);
      }

      if (!item.updated_at) {
        item.updated_at = item.created_at || Huddle.Utils.agoraISO();
      }
    }

    return item;
  },

  dataHoraBackupParaISO(dataBR, horaBR = "") {
    if (!dataBR || typeof dataBR !== "string") return Huddle.Utils.agoraISO();

    const partes = dataBR.split("/").map(Number);
    if (partes.length !== 3) return Huddle.Utils.agoraISO();

    const [dia, mes, ano] = partes;
    const partesHora = String(horaBR || "00:00").split(":").map(Number);
    const hora = partesHora[0] || 0;
    const minuto = partesHora[1] || 0;

    const data = new Date(ano, mes - 1, dia, hora, minuto, 0, 0);

    if (Number.isNaN(data.getTime())) return Huddle.Utils.agoraISO();

    return data.toISOString();
  },

  async addLog({ id_reuniao = "", tipo = "", acao = "", detalhe = "", usuario = "" }) {
    const log = {
      id: Huddle.Utils.id("LOG"),
      id_reuniao,
      tipo,
      acao,
      detalhe,
      usuario,
      created_at: Huddle.Utils.agoraISO()
    };

    await this.add("logs", log);

    return log;
  }
};
