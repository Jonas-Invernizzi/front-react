import { useEffect, useState } from "react";
import { listTasks } from "../services/tasks";
import axios from "axios";
import { getErrorMessage } from "../services/api";

export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [status, setStatus] = useState("loading");
    const [loadError, setLoadError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

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
    return {tasks, status, loadError, reload};
}