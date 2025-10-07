import React, { useState } from "react";
import { useLoginMutation } from "../features/auth/authApi";
import { toast } from "react-toastify";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      toast.success("Logged in");
      // window.location.href could be replaced by router navigation
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Login failed");
    }
  }

  return (
    <div
      style={{ maxWidth: 360, margin: "64px auto", fontFamily: "system-ui" }}
    >
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
