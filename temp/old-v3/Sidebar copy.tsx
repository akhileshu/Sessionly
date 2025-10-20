"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { AppModal } from "../../src/components/app-model/app-model";
import { PreferencesPanel } from "../../src/components/sessionTracker/PreferencesPanel";
import { Button } from "../../src/components/shared/Button";
import { Icon } from "../../src/components/shared/icons";
import { Pill } from "../../src/components/shared/pill";
// -------------------- MAIN --------------------

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

  const isEmpty = !projects.length && !categories.length;

  return (
    <Sidebar className={cn("w-64 border-r", className)}>
      <SidebarHeader className="p-3">
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent className="space-y-4 px-3">
        <Accordion type="single" collapsible className="">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Pill>Projects & Categories</Pill>
            </AccordionTrigger>

            <AccordionContent>
              <SidebarGroup
                title="Projects & Categories"
                className="border rounded-md"
              >
                <AppModal
                  trigger="Add Project / Category"
                  type="addProjectAndCategory"
                />

                {isEmpty ? (
                  <Button
                    onClick={initSampleProjectsAndCategories}
                    variant="primary"
                    icon="add"
                    size="sm"
                    className="my-2 w-full"
                  >
                    Add Sample Projects & Categories
                  </Button>
                ) : (
                  <>
                    <ItemSection
                      title="Projects"
                      items={projects}
                      onDelete={removeProject}
                      onClear={clearProjects}
                    />
                    <ItemSection
                      title="Categories"
                      items={categories}
                      onDelete={removeCategory}
                      onClear={clearCategories}
                    />
                  </>
                )}
              </SidebarGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Pill>My Preferences</Pill>
            </AccordionTrigger>

            <AccordionContent>
              <SidebarGroup
                className="border rounded-md"
                title="My Preferences"
              >
                <PreferencesPanel className="p-1" />
              </SidebarGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Social />
      </SidebarFooter>
    </Sidebar>
  );
}

// -------------------- ITEM SECTION --------------------

function ItemSection({
  title,
  items,
  onDelete,
  onClear,
}: {
  title: string;
  items: string[];
  onDelete: (item: string) => void;
  onClear: () => void;
}) {
  const { confirmable } = useDeleteHandler();

  return (
    <div className="border-b last:border-b-0 py-2">
      <Pill className="w-fit mx-auto mb-0 mt-3">{title}</Pill>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">
          No {title.toLowerCase()}
        </p>
      ) : (
        <>
          {items.map((item) => (
            <div
              key={item}
              className="flex justify-between items-center px-2 py-1 hover:bg-gray-800 rounded"
            >
              <span>{item}</span>
              <Icon
                name="delete"
                size={16}
                className="cursor-pointer text-gray-500 hover:text-red-500"
                onClick={confirmable(() => onDelete(item))}
                title={`Delete ${item}`}
              />
            </div>
          ))}
          <Button
            variant="danger"
            size="sm"
            icon="delete"
            onClick={confirmable(onClear)}
            className="my-2 w-full"
          >
            Delete All
          </Button>
        </>
      )}
    </div>
  );
}

// -------------------- SOCIAL LINKS --------------------

const socials = [
  {
    href: "https://github.com/akhileshu/Sessionly",
    name: "github",
    title: "Star this repo on GitHub",
  },
  {
    href: "https://akhilesh-portfolio-zeta.vercel.app/",
    name: "globe",
    title: "My portfolio - Akhilesh Upadhyay",
  },
  {
    href: "mailto:umapati4381@gmail.com",
    name: "envelope",
    title: "Email me @ umapati4381@gmail.com",
  },
  {
    name: "location",
    title: "Hyderabad",
  },
];

function Social({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-around text-muted-foreground",
        className
      )}
    >
      {socials.map(({ href, name, title }) => (
        <a
          key={name}
          href={href}
          target={href ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
          title={title}
        >
          <Icon title={title} name={name as any} />
        </a>
      ))}
    </div>
  );
}
