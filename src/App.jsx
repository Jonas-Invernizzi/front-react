// Ponto de partida da aula.
// O visual pronto (com todas as classes) está em /prototipo/index.html —
// abra http://localhost:5173/prototipo/ com o `npm run dev` rodando.

import { useTasks } from "./hooks/useTasks"
  
export default function App() {
  const { tasks, status, loadError, reload } = useTasks();

  return (
    <main className="app">
      <section className="notebook" aria-labelledby="titulo">
        <header className="notebook__header">
          <h1 className="notebook__title" id="titulo">Tarefas</h1>
        </header>

      {status === "loading" && (<div className="notice notice--loading" role="status"><p>Carregando tarefas</p></div>)}    
      
      {status === "error" && (<div className="notice notice--error" role="alert"><p>Erro ao carregar tarefas: {loadError}</p><button onClick={reload}>Tentar novamente</button></div>)}
      
      {status === "success" && (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task">
              <span />
              <span className= "task__body">{task.titulo}</span>
            </li>
          ))}
        </ul>
      )}
      </section>
    </main>
  )
}
