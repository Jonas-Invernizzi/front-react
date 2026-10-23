import {api} from "./api";
const unwrap = (response) => response.data?.data ?? response.data;

export async function listTasks({signal} = {}) {
    return unwrap(await api.get("/tarefas", {signal}));
}