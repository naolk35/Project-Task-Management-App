import React, { useMemo, useState } from "react";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../features/tasks/tasksApi";
import type { TaskStatus } from "../types";

const statuses: TaskStatus[] = ["todo", "in_progress", "done"];

export default function TasksPage(): JSX.Element {
  const { data, isLoading, isError, refetch } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<number>(1);
  const [assigneeId, setAssigneeId] = useState<number | "" | null>("");
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter((t) => t.status === filter);
  }, [data, filter]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createTask({
      title,
      description,
      projectId,
      assigneeId: assigneeId === "" ? null : Number(assigneeId),
    }).unwrap();
    setTitle("");
    setDescription("");
    setAssigneeId("");
    refetch();
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Tasks</h2>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading tasks</p>}

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <label>
          Filter:
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form
        onSubmit={handleCreate}
        style={{ display: "grid", gap: 8, marginBottom: 16 }}
      >
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="Assignee ID (optional)"
          value={assigneeId ?? ""}
          onChange={(e) =>
            setAssigneeId(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ display: "grid", gap: 8 }}>
        {filtered.map((t) => (
          <li key={t.id} style={{ border: "1px solid #ccc", padding: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                defaultValue={t.title}
                onBlur={(e) => updateTask({ id: t.id, title: e.target.value })}
              />
              <select
                defaultValue={t.status}
                onChange={(e) =>
                  updateTask({ id: t.id, status: e.target.value as TaskStatus })
                }
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button onClick={() => deleteTask(t.id)}>Delete</button>
            </div>
            <small>{t.description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
