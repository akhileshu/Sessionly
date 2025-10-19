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
import { useDeleteHandler } from "@/hooks/useDeleteHandler";
import { cn } from "@/lib/utils";
import { AppModal } from "../src/components/app-model/app-model";
import { PreferencesPanel } from "../src/components/PreferencesPanel";
import { Button } from "../src/components/shared/Button";
import { Icon } from "../src/components/shared/icons";
import { Pill } from "../src/components/shared/pill";

export function AppSidebar({ className }: { className?: string }) {
  const { confirmable } = useDeleteHandler();
  const {
    projects,
    categories,
    removeProject,
    removeCategory,
    clearProjects,
    clearCategories,
    initSampleProjectsAndCategories,
  } = useSessionStore();

  return (
    <Sidebar className={cn("w-64 border-r", className)}>
      <SidebarHeader className="p-3">
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent className="space-y-4 px-3">
        <SidebarGroup
          title="Projects & Categories"
          className="border rounded-md"
        >
          <AppModal
            trigger="Add Project / Category"
            type="addProjectAndCategory"
          />
          {!projects.length && !categories.length ? (
            <Button
              onClick={initSampleProjectsAndCategories}
              variant="primary"
              icon="add"
              size="sm"
              className="my-2"
            >
              Add Sample Projects & Categories
            </Button>
          ) : (
            <>
              <Pill className="w-fit mx-auto mb-0 mt-3">Projects</Pill>
              <div title="Projects" className="border-b">
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
                        onClick={confirmable(() => removeProject(project))}
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
                    onClick={confirmable(() => clearProjects())}
                    className="my-2"
                  >
                    Delete All
                  </Button>
                )}
              </div>
              <Pill className="w-fit mx-auto mb-0 mt-3">Categories</Pill>
              <div title="Categories">
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
                        onClick={confirmable(() => removeCategory(category))}
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
                    onClick={confirmable(() => clearCategories())}
                    className="my-2"
                  >
                    Delete All
                  </Button>
                )}
              </div>
            </>
          )}
        </SidebarGroup>
        <SidebarGroup className="border rounded-md" title="My Preferences">
          <PreferencesPanel className="p-1" />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
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
