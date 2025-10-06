import React, { useState } from "react";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../features/projects/projectsApi.ts";

export default function ProjectsPage(): JSX.Element {
  const { data, isLoading, isError, refetch } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createProject({ title, description }).unwrap();
    setTitle("");
    setDescription("");
    refetch();
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Projects</h2>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading projects</p>}

      <form
        onSubmit={handleCreate}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
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
        <button type="submit">Add</button>
      </form>

      <ul style={{ display: "grid", gap: 8 }}>
        {(data ?? []).map((p) => (
          <li key={p.id} style={{ border: "1px solid #ccc", padding: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                defaultValue={p.title}
                onBlur={(e) =>
                  updateProject({ id: p.id, title: e.target.value })
                }
              />
              <button onClick={() => deleteProject(p.id)}>Delete</button>
            </div>
            <small>{p.description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
