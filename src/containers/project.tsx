import {memo} from "react";

import {useDocumentTitle} from "../hooks/useDocumentTitle";
import {useProjects} from "../context/project-state-provider";
import {TODOContainer} from "../containers/todo";
import {AnimatePresence} from "framer-motion";

export const Project = memo(() => {
  const {project} = useProjects();

  useDocumentTitle(project?.name || "todo");

  return (
    <AnimatePresence>{project ? <TODOContainer /> : null}</AnimatePresence>
  );
});
