import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

export async function listUsers(_req: Request, res: Response): Promise<void> {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
  });
  res.json(users);
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const user = await User.findByPk(Number(req.params.id), {
    attributes: { exclude: ["passwordHash"] },
  });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role?: string;
  };
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: (role as any) ?? "employee",
  });
  res
    .status(201)
    .json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const user = await User.findByPk(Number(req.params.id));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const { name, email, password, role } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) (user as any).role = role as any;
  if (password) user.passwordHash = await bcrypt.hash(password, 10);
  await user.save();
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const deleted = await User.destroy({ where: { id: Number(req.params.id) } });
  if (!deleted) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(204).send();
}
