# Tarefas — front-end (React + Vite + React Compiler)

Base do front-end da lista de tarefas que consome a API em Laravel.
Já vem configurado: Vite 8, React 19, React Compiler, ESLint com as regras
do compilador, axios instalado, proxy para o Laravel e todo o CSS.
**O código React do app fica para ser construído em aula.**

## Como rodar

```bash
cp .env.example .env
npm install
npm run dev
```

- App: http://localhost:5173
- Protótipo visual com todos os estados: http://localhost:5173/prototipo/

O back-end (container do Laravel) precisa estar rodando. Confira no
`vite.config.js` se o `target` do proxy aponta para a porta que o container
expõe (lado esquerdo do `ports:` no `docker-compose.yml`).

## Comunicação com o Laravel

O `vite.config.js` tem um **proxy**: tudo o que o front pede para `/api/...`
o Vite repassa para o Laravel (`http://localhost:8000/api/...` por padrão).
Para o navegador é tudo a mesma origem, então não há problema de CORS
durante o desenvolvimento, mesmo com o Laravel em outra porta no Docker.

O endereço base fica no `.env` (copiado de `.env.example`):

```
VITE_API_URL=/api
```

No código, ele é lido com `import.meta.env.VITE_API_URL`.
Só variáveis que começam com `VITE_` ficam visíveis no front.

### Contrato esperado da API

O CSS e o protótipo partem do princípio de que a tarefa tem este formato
(ajuste se o back-end de vocês usar outros nomes):

```json
{ "id": 1, "titulo": "Criar a migration", "descricao": "Opcional", "concluida": false }
```

| Ação                 | Método e rota              |
| -------------------- | -------------------------- |
| Listar               | `GET    /api/tarefas`      |
| Criar                | `POST   /api/tarefas`      |
| Editar / concluir    | `PATCH  /api/tarefas/{id}` |
| Apagar               | `DELETE /api/tarefas/{id}` |

No Laravel, isso sai de `Route::apiResource('tarefas', TarefaController::class)`
em `routes/api.php` (se o arquivo não existir: `php artisan install:api`).
Se as rotas estiverem em `routes/web.php` (sem `/api`), use o `rewrite`
comentado no `vite.config.js` — mas lembre que rotas web exigem token CSRF
em POST, PATCH e DELETE; para uma API, `routes/api.php` é o lugar certo.
Se o controller devolver um `JsonResource`, os dados chegam dentro de
`data` — no axios, `response.data.data`.

## Estrutura

```
├── index.html            página que carrega o React
├── vite.config.js        React Compiler + proxy para o Laravel
├── eslint.config.js      inclui as regras do React Compiler
├── .env.example          VITE_API_URL
├── prototipo/
│   └── index.html        HTML estático com todos os estados (referência)
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx          monta o <App /> na página
    ├── App.jsx           ponto de partida (vazio)
    ├── index.css         todo o visual do app
    ├── components/       componentes React
    └── services/         acesso à API (axios)
```

## React Compiler

O compilador memoiza os componentes automaticamente na hora do build, então
**não é preciso usar `useMemo`, `useCallback` nem `memo`** no dia a dia.
Ele só funciona em componentes que seguem as Regras do React (render puro,
não mutar estado nem props, hooks sempre no topo do componente).

Rodem `npm run lint` com frequência: o `eslint-plugin-react-hooks` avisa
quando algum trecho quebra essas regras e o compilador teria de pular o
componente. Na extensão React DevTools, componentes otimizados aparecem com
o selo **Memo ✨**.

## Guia de classes

Abra o protótipo para ver cada estado funcionando. Resumo:

### Estrutura da página

| Elemento                      | Classe                                  |
| ----------------------------- | --------------------------------------- |
| Container da página (`main`)  | `.app`                                  |
| Folha do caderno (`section`)  | `.notebook`                             |
| Cabeçalho / título / resumo   | `.notebook__header`, `.notebook__title`, `.notebook__summary` |

### Nova tarefa (`form.task-form`)

| Elemento        | Classe                                       |
| --------------- | -------------------------------------------- |
| Sinal de “+”    | `.task-form__mark` (com `aria-hidden="true"`) |
| Título          | `input.task-form__input`                     |
| Descrição       | `textarea.task-form__details`                |
| Botão           | `.button.button--primary`                    |

### Lista e tarefas

| Elemento / estado        | Classe ou atributo                                |
| ------------------------ | ------------------------------------------------- |
| Lista (`ul`)             | `.task-list`                                      |
| Tarefa (`li`)            | `.task`                                           |
| Concluída                | `.task.task--done` + checkbox marcado             |
| Em edição                | `.task.task--editing`                             |
| Aguardando a API         | `aria-busy="true"` no `li`                        |
| Área do checkbox         | `.task__check` com `input.checkbox`               |
| Texto (título + descrição) | `.task__body` com `.task__title` e `p.task__description` (só quando houver descrição) |
| Botões da linha          | `.task__actions` com `button.task-action`         |
| Botão de apagar          | `.task-action.task-action--danger`                |
| Botão de salvar          | `.task-action.task-action--primary`               |
| Formulário de edição     | `form.task__edit` com `.task__fields` (`input.task__input` + `textarea.task__input.task__input--details`) e `.task__actions` |

### Avisos

| Situação     | Classe                                   |
| ------------ | ---------------------------------------- |
| Carregando   | `.notice.notice--loading` (`role="status"`) |
| Lista vazia  | `.notice`                                |
| Erro         | `.notice.notice--error` (`role="alert"`) + `.button.button--danger` |

### Utilitários

- `.visually-hidden`: esconde um texto da tela, mas mantém para leitores de tela
  (usado nos `label` dos inputs).
- Lembrem de dar um `aria-label` para cada checkbox, por exemplo
  `Concluir: <título da tarefa>`.

O tema escuro é automático (segue o sistema operacional) e as animações
respeitam a configuração de movimento reduzido.
