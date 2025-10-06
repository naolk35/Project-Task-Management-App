import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { Task } from "../models/task.model.js";

export async function listTasks(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const role = req.user?.role;
  const userId = req.user?.id;
  if (role === "admin" || role === "manager") {
    const tasks = await Task.findAll();
    res.json(tasks);
    return;
  }
  const tasks = await Task.findAll({ where: { assigneeId: userId } });
  res.json(tasks);
}

export async function getTask(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const task = await Task.findByPk(Number(req.params.id));
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.json(task);
}

export async function createTask(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const { title, description, status, projectId, assigneeId } = req.body as {
    title: string;
    description?: string;
    status?: string;
    projectId: number;
    assigneeId?: number;
  };
  const task = await Task.create({
    title,
    description: description ?? null,
    status: (status as any) ?? "todo",
    projectId,
    assigneeId: assigneeId ?? null,
  });
  res.status(201).json(task);
}

export async function updateTask(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const role = req.user?.role;
  const userId = req.user?.id;
  const task = await Task.findByPk(Number(req.params.id));
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  if (role === "employee") {
    const { status } = req.body as { status?: string };
    if (task.assigneeId !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    if (!status) {
      res.status(400).json({ message: "status is required" });
      return;
    }
    (task as any).status = status as any;
    await task.save();
    res.json(task);
    return;
  }

  const { title, description, status, projectId, assigneeId } = req.body as {
    title?: string;
    description?: string;
    status?: string;
    projectId?: number;
    assigneeId?: number | null;
  };
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) (task as any).status = status as any;
  if (projectId !== undefined) task.projectId = projectId;
  if (assigneeId !== undefined) task.assigneeId = assigneeId;
  await task.save();
  res.json(task);
}

export async function deleteTask(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const deleted = await Task.destroy({ where: { id: Number(req.params.id) } });
  if (!deleted) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.status(204).send();
}
