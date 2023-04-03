import {useMemo, useRef, memo} from "react";
import {AddIcon} from "../components/icons";

import {useTODOactions, useTODOs} from "../context/tasks-state-provider";
import {Tree} from "../components/todo/todo-tree";
import {useSearchParams} from "../hooks/useSearchParams";
import {motion} from "framer-motion";

export const TODOContainer = memo(() => {
  const {search, add, set, update, remove} = useTODOactions();

  const todos = useTODOs();
  const [query, setQuery] = useSearchParams("search");

  const filtered = useMemo(() => (query ? search(query) : []), [query]);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      exit={{scale: 0.95, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      initial={{scale: 0.95, opacity: 0}}
      className="h-full overflow-auto flex flex-col"
    >
      <div className="flex items-center gap-2 text-white">
        <input
          onChange={(e) => setQuery({search: e.target.value})}
          className="bg-slate-700  border border-slate-600 text-white rounded p-2 w-60"
          placeholder="Search..."
          defaultValue={query || ""}
        />

        <input
          ref={ref}
          className="w-full h-full border px-2 border-slate-600 bg-slate-700 rounded"
          placeholder="New task"
        />
        <button
          onClick={() => {
            ref.current &&
              add([], {
                key: String(todos.length),
                label: ref.current.value,
                children: [],
                marked: false,
              });
          }}
          className="rounded w-12 h-full text-center hover:bg-green-300 bg-slate-700  border border-slate-600 hover:text-slate-800"
        >
          <AddIcon className="w-6 h-6 mx-auto" />
        </button>
      </div>

      <Tree
        nodes={query ? filtered : todos}
        depth={[]}
        actions={{add, set, update, remove}}
      />
    </motion.div>
  );
});
