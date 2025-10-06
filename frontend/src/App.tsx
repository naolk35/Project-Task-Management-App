import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import ManagerDashboard from "./pages/ManagerDashboard.tsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import TasksPage from "./pages/TasksPage.tsx";
import ThemeToggle from "./components/ThemeToggle.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App(): JSX.Element {
  const isAuthed = Boolean(localStorage.getItem("token"));
  return (
    <BrowserRouter>
      <div style={{ padding: 12 }}>
        <ThemeToggle />
      </div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={isAuthed ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/manager"
          element={isAuthed ? <ManagerDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/employee"
          element={isAuthed ? <EmployeeDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects"
          element={isAuthed ? <ProjectsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/tasks"
          element={isAuthed ? <TasksPage /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthed ? "/admin" : "/login"} />}
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  );
}
