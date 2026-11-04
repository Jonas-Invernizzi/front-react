import { useActionState } from "react";

const empty = { titulo: "", descricao: "" };

export default function TaskForm({ onAdd }) {
  const [state, formAction, isPending] = useActionState(
    async (_previousState, formData) => {
      const titulo = formData.get("titulo").trim();
      const descricao = formData.get("descricao").trim();
      if (!titulo) return empty;
      const ok = await onAdd({ titulo, descricao: descricao || null });
      return ok ? empty : { titulo, descricao };
    },
  ), empty;
}
