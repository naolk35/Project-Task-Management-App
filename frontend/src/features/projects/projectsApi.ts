import { apiSlice } from "../../store/apiSlice.ts";
import type { Project } from "../../types/index.ts";

type CreateProjectDto = { title: string; description?: string };
type UpdateProjectDto = { id: number; title?: string; description?: string };

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => ({ url: "/projects" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Project" as const, id: p.id })),
              { type: "Project" as const, id: "LIST" },
            ]
          : [{ type: "Project" as const, id: "LIST" }],
    }),
    createProject: builder.mutation<Project, CreateProjectDto>({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    updateProject: builder.mutation<Project, UpdateProjectDto>({
      query: ({ id, ...patch }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Project", id: result.id }] : [],
    }),
    deleteProject: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
