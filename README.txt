HuddleFlow - Versão Local / PWA

Aplicação local para gestão de reuniões rápidas, setores presentes, perguntas, pendências, prazos, logs, backup e dashboard de conformidade.

1. Estrutura

index.html
css/style.css
js/*.js
data/seed.js
manifest.json
sw.js
images/

2. Como testar localmente

No terminal, dentro da pasta do projeto:

python -m http.server 8000

Abra a porta 8000 no navegador.

3. Como publicar

Suba todos os arquivos no GitHub Pages ou em outra hospedagem estática.

4. Como instalar no tablet

Abra o link no Chrome do tablet e use:

Menu ⋮ > Instalar app

ou:

Menu ⋮ > Adicionar à tela inicial

5. Dados locais

Os dados ficam salvos no navegador/dispositivo usando IndexedDB.
Use Configurações > Backup local para exportar e importar dados entre dispositivos.

6. Meta de conformidade

A meta padrão é 80% e pode ser alterada em Configurações > Metas.

7. Observação sobre atualização

Se uma versão anterior usava outro banco local, exporte um backup antes da atualização e importe depois nesta versão.
