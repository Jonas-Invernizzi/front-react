import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onEdit, onRemove }) {
    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onRemove={onRemove} />
            ))}
        </ul>
    )
}