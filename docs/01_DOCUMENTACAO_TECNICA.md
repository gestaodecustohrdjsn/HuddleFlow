# HuddleFlow — Documentação técnica

## Visão geral

O HuddleFlow é uma aplicação web progressiva para registrar reuniões rápidas, setores participantes, perguntas, respostas, pendências, prazos e indicadores de conformidade.

A aplicação é estática no frontend e usa armazenamento local do navegador.

## Arquitetura

```text
Frontend: HTML, CSS e JavaScript
Banco local: IndexedDB
Instalação: PWA
Backup: JSON exportável/importável
Hospedagem: estática
```

## Entidades principais

### Reuniões

Representam o evento central do sistema.

Campos principais:

```text
id
data
hora_inicio
hora_fim
responsavel_nome
status
created_at
updated_at
```

### Setores

Unidades ou áreas que podem participar das reuniões.

```text
id
nome
grupo
ordem
ativo
created_at
updated_at
```

### Reunião x Setores

Registra quais setores participaram de cada reunião e o tipo de presença.

```text
id
id_reuniao
id_setor
tipo_presenca
respondido
ordem
created_at
updated_at
```

Tipo de presença:

```text
Coordenador
Representante
```

### Perguntas

Perguntas configuráveis por setor.

```text
id
id_setor
ordem
texto
tipo
obrigatoria
gera_pendencia
resposta_gera_pendencia
ativo
created_at
updated_at
```

Tipos de resposta:

```text
NUMERO
SIM_NAO
TEXTO
LISTA
MULTIPLA_ESCOLHA
```

### Respostas

Registros das respostas dadas em cada reunião.

```text
id
id_reuniao
id_setor
id_pergunta
resposta
observacao
created_at
updated_at
```

### Pendências

Pendências geradas durante reuniões e acompanhadas até resolução, prorrogação ou remoção.

```text
id
id_reuniao_origem
id_setor
id_pergunta
id_resposta
descricao
observacao
resposta_contexto
prazo_tipo
prazo_valor
prazo_data
status
removida
prorrogacoes
created_at
updated_at
resolved_at
removed_at
```

Status principais:

```text
Aberta
Resolvida
Removida
```

### Logs

Registros de ações relevantes.

```text
id
id_reuniao
tipo
acao
detalhe
usuario
created_at
```

## Conformidade

A regra inicial é simples:

```text
Pergunta respondida sem pendência = conforme
Pergunta respondida com uma ou mais pendências = não conforme
```

A meta padrão é 80% e pode ser alterada pelo painel de configurações.

## Backup

O backup exporta todas as stores do IndexedDB para um arquivo JSON.

O arquivo pode ser importado em outro navegador/dispositivo, substituindo os dados locais existentes.

## Observação LGPD

A aplicação não deve registrar dados pessoais sensíveis de pacientes, nomes de pacientes, prontuários ou identificadores clínicos. O uso recomendado é para gestão operacional e pendências de processo/setor.
