import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import React from "react";
import { Button } from "../Button";
import { Input } from "../input";

export const ProjectCategoryForm = ({
  addProject,
  addCategory,
  project,
  setProject,
  category,
  setCategory,
}: {
  project: string;
  category: string;
  addProject: (project: string) => void;
  addCategory: (category: string) => void;
  setProject: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <div className="space-y-4">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addProject(project);
      }}
      className="space-y-2"
    >
      <Input
        placeholder="Add project"
        value={project}
        required
        onChange={(e) => setProject(e.target.value)}
      />
      <Button type="submit">Add Project</Button>
    </form>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addCategory(project);
      }}
      className="space-y-2"
    >
      <Input
        placeholder="Add category"
        value={category}
        required
        onChange={(e) => setCategory(e.target.value)}
      />
      <Button type="submit">Add Category</Button>
    </form>
  </div>
);
