"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSessionStore } from "@/context/useSessionStore";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddMetaDialog } from "./AddMetaDialog";
import { Button } from "./Button";
import { Icon } from "./icons";
import { Pill } from "./pill";

export function AppSidebar({ className }: { className?: string }) {
  const {
    projects,
    categories,
    removeProject,
    removeCategory,
    clearProjects,
    clearCategories,
    initSampleProjectsAndCategories,
  } = useSessionStore();

  const [showDialog, setShowDialog] = useState(false);

  return (
    <Sidebar className={cn("w-64 border-r", className)}>
      <SidebarHeader className="p-3">
        <SidebarTrigger className="ml-auto" />
        <Button
          onClick={() => setShowDialog(true)}
          variant="primary"
          icon="add"
          size="sm"
        >
          Add Project / Category
        </Button>
      </SidebarHeader>

      <SidebarContent className="space-y-4 px-3">
        {/* Projects */}
        <Pill className="w-fit mx-auto mb-0">Projects</Pill>
        <SidebarGroup title="Projects">
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500">No projects</p>
          ) : (
            projects.map((project) => (
              <div
                key={project}
                className="flex justify-between items-center px-2 py-1 hover:bg-gray-800 rounded"
              >
                <span>{project}</span>
                <Icon
                  name="delete"
                  size={16}
                  className="cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => removeProject(project)}
                  title={`Delete ${project}`}
                />
              </div>
            ))
          )}
          {projects.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon="delete"
              onClick={clearProjects}
            >
              Delete All
            </Button>
          )}
        </SidebarGroup>

        {/* Categories */}
        <Pill className="w-fit mx-auto mb-0">Categories</Pill>
        <SidebarGroup title="Categories">
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">No categories</p>
          ) : (
            categories.map((category) => (
              <div
                key={category}
                className="flex justify-between items-center px-2 py-1 hover:bg-gray-800 rounded"
              >
                <span>{category}</span>
                <Icon
                  name="delete"
                  size={16}
                  className="cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => removeCategory(category)}
                  title={`Delete ${category}`}
                />
              </div>
            ))
          )}
          {categories.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon="delete"
              onClick={clearCategories}
            >
              Delete All
            </Button>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {showDialog && <AddMetaDialog onClose={() => setShowDialog(false)} />}
        {!projects.length && !categories.length && (
          <Button
            onClick={initSampleProjectsAndCategories}
            variant="primary"
            icon="add"
            size="sm"
          >
            Add Sample Projects & Categories
          </Button>
        )}
        <Social />
      </SidebarFooter>
    </Sidebar>
  );
}

function Social({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-around text-muted-foreground",
        className
      )}
    >
      <a
        href="https://github.com/akhileshu/Sessionly"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
        title="GitHub"
      >
        <Icon title="star this repo on GitHub" name="github" />
      </a>

      <a
        href="https://akhilesh-portfolio-zeta.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
        title="Portfolio"
      >
        <Icon title="my portfolio - Akhilesh Upadhyay" name="globe" />
      </a>

      <a
        href="mailto:umapati4381@gmail.com"
        className="hover:text-foreground transition-colors"
        title="Email"
      >
        <Icon title="Email me @ umapati4381@gmail.com" name="envelope" />
      </a>

      <a title="Hyderabad" target="_blank" rel="noopener noreferrer">
        <Icon title="Hyderabad" name="location" />
      </a>
    </div>
  );
}

export default Social;
