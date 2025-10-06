import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";

export async function listProjects(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const role = req.user?.role;
  const userId = req.user?.id;

  if (role === "admin") {
    const projects = await Project.findAll();
    res.json(projects);
    return;
  }

  if (role === "manager") {
    const projects = await Project.findAll({ where: { ownerId: userId } });
    res.json(projects);
    return;
  }

  // employee => projects for tasks assigned to them
  const tasks = await Task.findAll({ where: { assigneeId: userId } });
  const projectIds = Array.from(new Set(tasks.map((t) => t.projectId)));
  const projects = await Project.findAll({ where: { id: projectIds } as any });
  res.json(projects);
}

export async function createProject(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const { title, description } = req.body as {
    title: string;
    description?: string;
  };
  const ownerId = req.user!.id;
  const project = await Project.create({
    title,
    description: description ?? null,
    ownerId,
  });
  res.status(201).json(project);
}

export async function updateProject(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const project = await Project.findByPk(Number(req.params.id));
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  const { title, description } = req.body as {
    title?: string;
    description?: string;
  };
  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;
  await project.save();
  res.json(project);
}

export async function deleteProject(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const deleted = await Project.destroy({
    where: { id: Number(req.params.id) },
  });
  if (!deleted) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  res.status(204).send();
}
