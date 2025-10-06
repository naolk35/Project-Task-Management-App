import { Sequelize } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./user.model.js";
import { Project } from "./project.model.js";
import { Task } from "./task.model.js";

// Associations
User.hasMany(Project, { as: "ownedProjects", foreignKey: "ownerId" });
Project.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

Project.hasMany(Task, { foreignKey: "projectId" });
Task.belongsTo(Project, { foreignKey: "projectId" });

User.hasMany(Task, { as: "assignedTasks", foreignKey: "assigneeId" });
Task.belongsTo(User, { as: "assignee", foreignKey: "assigneeId" });

export { sequelize, Sequelize, User, Project, Task };
