"use client";
import { useSessionStore } from "@/context/useSessionStore";
import React, { useState } from "react";
import { Button } from "../shared/Button";
import { Input } from "../shared/input";

interface ProjectCategoryFormProps {}

export const ProjectCategoryForm: React.FC<ProjectCategoryFormProps> = ({}) => {
  const [project, setProject] = useState("");
  const [category, setCategory] = useState("");
  const { addProject, addCategory } = useSessionStore();
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.trim()) return;
    addProject(project.trim());
    setProject(""); // reset field
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) return;
    addCategory(category.trim());
    setCategory(""); // reset field
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddProject} className="space-y-2">
        <Input
          placeholder="Add project"
          className="m-1 mr-4"
          value={project}
          required
          onChange={(e) => setProject(e.target.value)}
        />
        <Button type="submit">Add Project</Button>
      </form>

      <form onSubmit={handleAddCategory} className="space-y-2">
        <Input
          className="m-1 mr-4"
          placeholder="Add category"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button type="submit">Add Category</Button>
      </form>
    </div>
  );
};
