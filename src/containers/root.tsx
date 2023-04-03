import {motion} from "framer-motion";
import {
  TODOContextProvider,
  useTODOactions,
  useTODOs,
} from "../context/tasks-state-provider";
import {memo, useRef} from "react";
import {
  ProjectContextProvider,
  useProjects,
} from "../context/project-state-provider";
import {AddIcon} from "../components/icons";

import {Project} from "./project";
import {ImportButton} from "../components/import-button";
import {ExportButton} from "../components/export-button";

export const ProjectsNav = memo(() => {
  const ref = useRef<HTMLInputElement>(null);
  const {set} = useTODOactions();
  const todos = useTODOs();

  const {project, ...projectActions} = useProjects();

  const onNewProject = () => {
    if (ref.current) {
      projectActions.add(ref.current.value);
      set([], []);
    }
  };

  return (
    <div className="whitespace-nowrap flex w-full h-full py-2 gap-2 overflow-auto">
      <div className="h-full flex overflow-hidden border-2 border-slate-900 rounded-md items-center  justify-center">
        <button
          onClick={onNewProject}
          className="text-sm h-full uppercase text-white px-2 bg-slate-900"
        >
          <AddIcon className="w-5 h-5" />
        </button>
        <input
          ref={ref}
          placeholder="Create"
          className="px-2 bg-slate-700 placeholder:text-slate-400 text-xs uppercase h-full rounded-md text-white"
        />
      </div>
      <ImportButton
        onChange={(result) => {
          if (result) {
            const {todos, ...otherData} = result;
            projectActions.add(otherData.name);
            set([], todos);
          }
        }}
      />
      {project ? (
        <>
          <ExportButton
            disabled={!project}
            download={{...project, todos}}
            fileName={project.name}
          />

          <input
            className="h-full px-4 bg-slate-900 placeholder:text-slate-400 text-xs border-slate-700 border rounded-md"
            value={project.name || ""}
            placeholder="Project name"
            onChange={(e) =>
              projectActions.update({...project, name: e.target.value})
            }
          />
        </>
      ) : null}
    </div>
  );
});

export const Root = () => {
  return (
    <div className="bg-slate-800 h-fit rounded-md flex flex-col px-2">
      <TODOContextProvider>
        <ProjectContextProvider>
          <div className="h-14 w-full rounded-b-lg  flex items-center text-white">
            <ProjectsNav />
          </div>
          <div
            className="overflow-hidden rounded-md"
            style={{height: "calc(100vh - 3.5rem)"}}
          >
            <Project />
          </div>
        </ProjectContextProvider>
      </TODOContextProvider>
    </div>
  );
};
