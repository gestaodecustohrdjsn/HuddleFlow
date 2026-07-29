# HuddleFlow

Aplicação PWA local para gestão de reuniões rápidas, setores presentes, perguntas, pendências, prazos, logs, backup e dashboard de conformidade.

## Recursos principais

- PWA instalável no tablet ou computador
- Funcionamento local com IndexedDB
- Reuniões com data, horário, responsável e setores presentes
- Registro de presença por Coordenador ou Representante
- Perguntas configuráveis por setor
- Observação em qualquer resposta
- Pendências acumulativas com prazo, prorrogação, resolução e remoção
- Logs das principais ações
- Dashboard de conformidade, não conformidades e engajamento
- Backup local por arquivo JSON
- Meta de conformidade configurável, com padrão de 80%

## Como testar localmente

Dentro da pasta do projeto, execute:

```bash
python -m http.server 8000
```

Depois abra no navegador:

```text
http://localhost:8000
```

## Como publicar

O sistema pode ser publicado em qualquer hospedagem estática, como GitHub Pages, Netlify, Vercel ou servidor próprio.

## Como instalar no tablet

Abra o link no Chrome do tablet e use:

```text
Menu ⋮ > Instalar app
```

ou:

```text
Menu ⋮ > Adicionar à tela inicial
```

## Dados locais

Os dados ficam no navegador/dispositivo usando IndexedDB. Para transferir dados entre dispositivos, use:

```text
Configurações > Backup local > Exportar backup
Configurações > Backup local > Importar backup
```

## Meta de conformidade

A meta padrão é 80%. Para alterar:

```text
Configurações > Metas
```

## Estrutura

```text
index.html
manifest.json
sw.js
css/style.css
js/db.js
js/main.js
js/reunioes.js
js/perguntas.js
js/pendencias.js
js/configuracoes.js
js/dashboard.js
data/seed.js
images/
docs/
```
