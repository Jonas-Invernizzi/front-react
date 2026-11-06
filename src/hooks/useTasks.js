import { useEffect, useState } from "react";
import { createTask, listTasks, updateTask } from "../services/tasks";
import axios from "axios";
import { getErrorMessage } from "../services/api";

export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [status, setStatus] = useState("loading");
    const [loadError, setLoadError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [actionError, setActionError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        listTasks({signal: controller.signal})
        .then((data) => {
            setTasks(data);
            setStatus("success");
        })
        .catch((error) => {
            if (axios.isCancel(error)) {
                setLoadError(getErrorMessage(error));
                setStatus("error");
            }
        });
        return () => controller.abort();
    }, [reloadKey]);

    const reload = () => {
        setStatus("loading");
        setReloadKey((prevKey) => prevKey + 1);
    }

    async function run($request) {
        setActionError(null);
        try {
            await $request();
            return true;
        } catch (error) {
            console.error(error);
            setActionError(getErrorMessage(error));
            return false;
        }
    }

    const addTask = async (data) => {
        return run(async() => {
            const newTask = await createTask(data);
            setTasks((prevTasks) => [...prevTasks, newTask]);
        });
    };

    const toggleTask = async (task) => {
        run(async() => {
            const updatedTask = await updateTask(task.id, {concluida: !task.concluida});
            setTasks((prevTasks) => prevTasks.map((t) => (t.id === task.id ? updatedTask : t)));
        });
    };

    return {tasks, status, loadError, reload, actionError, clearActionError: () => setActionError(null), addTask, toggleTask};
}