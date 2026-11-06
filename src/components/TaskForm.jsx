import { useActionState } from "react";

const empty = { titulo: "", descricao: "" };

export default function TaskForm({ onAdd }) {
  const [state, formAction, isPending] = useActionState(
    async (_previousState, formData) => {
      const titulo = formData.get("titulo").trim();
      const descricao = formData.get("descricao").trim();

      if (!titulo) return empty;

      const ok = await onAdd({
        titulo,
        descricao: descricao || null,
      });

      return ok ? empty : { titulo, descricao };
    },
    empty,
  );

  return (
    <form className="task-form" action={formAction}>
      <span className="task-form__mark" aria-hidden="true">
        +
      </span>
      <label className="visually-hidden" htmlFor="nova-titulo">
        Título
      </label>
      <input
        id="nova-titulo"
        name="titulo"
        type="text"
        className="task-form__input"
        placeholder="O que precisa ser feito?"
        autoComplete="off"
        maxLength={255}
        required
        defaultValue={state.titulo}
        disabled={isPending}
      />
      <label className="visually-hidden" htmlFor="nova-descricao">
        Descrição
      </label>
      <textarea
        id="nova-descricao"
        name="descricao"
        className="task-form__details"
        placeholder="Adicione uma descrição (opcional)"
        rows={1}
        defaultValue={state.descricao}
        disabled={isPending}
      />

      <button
        type="submit"
        className="button button--primary"
        disabled={isPending}
      >
        {isPending ? "Adicionando..." : "Adicionar"}
      </button>
    </form>
  );
}
