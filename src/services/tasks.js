import {api} from "./api";
const unwrap = (response) => response.data?.data ?? response.data;

export async function listTasks({signal} = {}) {
    return unwrap(await api.get("/tarefas", {signal}));
}

export async function createTask(data) {
    return unwrap(await api.post("/tarefas", data));
}

export async function updateTask(id, changes) {
    return unwrap(await api.patch(`/tarefas/${id}`, changes));
}

export async function deleteTask(id) {
    return unwrap(await api.delete(`/tarefas/${id}`));
}