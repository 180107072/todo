import {LayoutGroup, Reorder, AnimatePresence} from "framer-motion";
import {memo} from "react";
import {
  TODOContextType,
  useTODOactions,
} from "../../context/tasks-state-provider";
import {Todo} from "../../types";

import {Node} from "./todo-node";

type TreeProps = {
  nodes: Todo[];
  depth: number[];
  actions: Pick<TODOContextType, "set" | "add" | "remove" | "update">;
};

export const Tree = memo(({nodes, depth, actions}: TreeProps) => {
  const {set, ...other} = actions;

  return (
    <LayoutGroup>
      <Reorder.Group
        axis="y"
        values={nodes}
        onReorder={(order) => set(depth, order)}
      >
        <AnimatePresence initial={false}>
          {nodes.map((task, i) => (
            <Reorder.Item key={task.key} value={task}>
              <Node
                task={task}
                depth={[...depth, i]}
                actions={{set, ...other}}
              />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </LayoutGroup>
  );
});
