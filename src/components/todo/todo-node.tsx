import {useAnimationControls, motion, AnimatePresence} from "framer-motion";
import {memo, useState, useRef} from "react";
import {MarkIcon, AddIcon, DeleteIcon} from "../icons";
import {AnimatedWrapper} from "../layouts";
import {
  TODOContextType,
  useTODOactions,
} from "../../context/tasks-state-provider";
import {createKey} from "../../utils";
import {Todo} from "../../types";

import {Tree} from "./todo-tree";

type NodeProps = {
  task: Todo;
  depth: number[];
  actions: Pick<TODOContextType, "add" | "remove" | "update" | "set">;
};

export const Node = memo(
  ({task, depth, actions: {add, remove, update, set}}: NodeProps) => {
    const controls = useAnimationControls();

    const [state, setState] = useState({
      add: false,
    });

    const ref = useRef<HTMLInputElement>(null);
    const todoLabel = useRef<HTMLParagraphElement>(null);

    return (
      <AnimatedWrapper>
        <div className="bg-slate-900/40 p-2 w-full border rounded border-slate-600">
          <div
            className="flex p-1 items-center gap-4"
            onDoubleClick={() => {
              if (!todoLabel.current) return;

              todoLabel.current.contentEditable = "true";
              todoLabel.current.focus();
            }}
          >
            <motion.button
              whileTap={{scale: 0.8}}
              onClick={(e) => {
                e.stopPropagation();
                update(depth, {...task, marked: !task.marked});
              }}
              className={`rounded p-1 hover:bg-green-300 ${
                !task.marked
                  ? "bg-green-300/40 "
                  : "bg-green-300 text-slate-600"
              } hover:text-slate-800`}
            >
              <MarkIcon className="w-3 h-3" />
            </motion.button>
            <p
              style={{
                textDecorationLine: task.marked ? "line-through" : "initial",
              }}
              ref={todoLabel}
              className="leading-8 hover:bg-slate-800/90 cursor-text rounded-md px-2"
              onBlur={(e) => {
                update(depth, {...task, label: e.currentTarget.innerText});
                e.currentTarget.contentEditable = "false";
              }}
            >
              {task.label}
            </p>
          </div>

          <Tree
            nodes={task.children}
            depth={depth}
            actions={{add, remove, update, set}}
          />

          <AnimatePresence initial={false}>
            {state.add ? (
              <AnimatedWrapper>
                <div className="flex w-full">
                  <div className="flex w-full items-center bg-slate-800 p-2 gap-2 mt-2 border rounded border-slate-500">
                    <input
                      ref={ref}
                      className="w-full p-2 h-full bg-slate-700 rounded"
                      placeholder="New task"
                    />
                    <button
                      className="rounded flex p-1 ml-auto hover:bg-green-300 hover:text-slate-800"
                      onClick={(e) => {
                        if (!ref.current) return;
                        const newTask = {
                          key: createKey(task),
                          label: ref.current.value,
                          children: [],
                          marked: false,
                        };
                        add(depth, newTask);
                      }}
                    >
                      <MarkIcon className="w-1 h-1" />
                    </button>
                  </div>
                </div>
              </AnimatedWrapper>
            ) : null}
          </AnimatePresence>
        </div>
        <motion.button
          onClick={() => {
            controls
              .start({rotate: state.add ? 0 : 45})
              .then(() => setState({...state, add: !state.add}));
          }}
          className="bg-blue-800/50 p-1 ml-2  rounded hover:bg-blue-600 border border-blue-600 hover:text-slate-300"
        >
          <motion.div animate={controls} transition={{duration: 0.1}}>
            <AddIcon className="w-5 h-5" />
          </motion.div>
        </motion.button>
        <motion.button
          onClick={() => remove(depth, task.key)}
          className="bg-red-800/50 p-1 ml-2  rounded hover:bg-red-600 border border-red-600 hover:text-slate-100"
        >
          <DeleteIcon className="w-5 h-5" />
        </motion.button>
      </AnimatedWrapper>
    );
  }
);
