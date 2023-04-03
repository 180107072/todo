import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import {Project, Todo} from "../types";

export interface TODOContextType {
  tasks: Todo[];
  add: (depth: number[], task: Todo) => void;
  remove: (depth: number[], key: string) => void;
  set: (depth: number[], tasks: Todo[]) => void;
  get: (depth: number[]) => Todo;
  search: (query: string) => Todo[];
  update: (depth: number[], update: Todo) => void;
}

export const TODOContext = createContext<TODOContextType | null>(null);

export const TODOContextProvider: FC<PropsWithChildren> = ({children}) => {
  const [tasks, setTasks] = useState<Todo[]>([]);

  const rerender = () => setTasks([...tasks]);

  const get = (depth: number[]) => {
    const [idx, ...childrens] = depth;
    const root = tasks[idx];

    let todo = root;

    for (const i of childrens) {
      todo = todo.children![i];
    }

    return todo;
  };

  const add = (depth: number[], newTask: Todo) => {
    if (!depth.length) return setTasks([newTask, ...tasks]);

    const todo = get(depth);

    todo.children = [...todo.children, newTask];
    rerender();
  };

  const remove = (depth: number[], key: string) => {
    if (depth.length <= 1)
      return setTasks(tasks.filter((task) => task.key !== key));

    const [idx, ...childrens] = depth;
    const root = tasks[idx];

    let parent = root;

    for (const i of childrens) {
      if (parent.children[i].key !== key) parent = parent.children[i];
    }

    parent.children = parent.children.filter((v) => v.key !== key);
    rerender();
  };

  const update = (depth: number[], updatedTodo: Todo) => {
    if (depth.length <= 1)
      return setTasks(
        tasks.map((v) => (v.key === updatedTodo.key ? updatedTodo : v))
      );

    const [idx, ...childrens] = depth;
    const root = tasks[idx];

    let parent = root;

    for (const i of childrens) {
      if (parent.children[i].key !== updatedTodo.key)
        parent = parent.children[i];
    }

    parent.children = parent.children.map((v) =>
      v.key === updatedTodo.key ? updatedTodo : v
    );
    rerender();
  };

  const set = (depth: number[], newTasks: Todo[]) => {
    if (!depth.length) return setTasks(() => [...newTasks]);
    const parent = get(depth);

    parent.children = newTasks;
    rerender();
  };

  const search = (query: string) => {
    const loop = (task: Todo & Record<string, any>): number | boolean =>
      Object.keys(task).some((k) => {
        if (Array.isArray(task[k])) {
          task[k] = task[k].filter(loop);
          return task[k].length;
        }

        if (typeof task[k] === "string" && task[k].includes(query)) return true;
      });

    const filter = () => JSON.parse(JSON.stringify(tasks)).filter(loop);

    return filter();
  };

  return (
    <TODOContext.Provider
      value={{
        tasks,
        add,
        remove,
        set,
        get,
        search,
        update,
      }}
    >
      {children}
    </TODOContext.Provider>
  );
};

export const useTODOactions = () => {
  const context = useContext(TODOContext);

  if (!context) throw Error("no context");

  const {add, remove, search, set, update, get} = context;

  return {add, remove, search, set, update, get};
};

export const useTODOs = () => {
  const context = useContext(TODOContext);

  if (!context) throw Error("no context");

  const {tasks} = context;

  return tasks;
};
