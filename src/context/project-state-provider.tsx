import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import {Todo, Project} from "../types";
import {nanoid} from "nanoid";

interface ProjectContextType {
  project: Project | null;
  add: (name: string) => void;
  update: (project: Project) => void;
}

export const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectContextProvider: FC<PropsWithChildren> = ({children}) => {
  const [project, setProject] = useState<Project | null>(null);

  const update = (update: Project) => {
    setProject(update);
  };

  const add = (name: string) => {
    const id = nanoid();

    setProject(() => ({id, name}));
  };

  return (
    <ProjectContext.Provider
      value={{
        add,
        update,
        project,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);

  if (!context) throw new Error("no context");

  return context;
};
