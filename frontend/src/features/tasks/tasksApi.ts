import { apiSlice } from "../../store/apiSlice";
import type { Task, TaskStatus } from "../../types";

type CreateTaskDto = {
  title: string;
  description?: string;
  projectId: number;
  assigneeId?: number | null;
};
type UpdateTaskDto = {
  id: number;
  title?: string;
  description?: string;
  status?: TaskStatus;
  projectId?: number;
  assigneeId?: number | null;
};

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => ({ url: "/tasks" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((t) => ({ type: "Task" as const, id: t.id })),
              { type: "Task" as const, id: "LIST" },
            ]
          : [{ type: "Task" as const, id: "LIST" }],
    }),
    createTask: builder.mutation<Task, CreateTaskDto>({
      query: (body) => ({ url: "/tasks", method: "POST", body }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation<Task, UpdateTaskDto>({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Task", id: result.id }] : [],
    }),
    deleteTask: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
