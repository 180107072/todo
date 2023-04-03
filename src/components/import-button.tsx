import {ComponentProps, FC, useRef} from "react";
import {FolderIcon} from "./icons";
import {Project, Todo} from "../types";

export const ImportButton: FC<
  Omit<ComponentProps<"button">, "onChange"> & {
    onChange: (result?: Project & {todos: Todo[]}) => void;
  }
> = ({onChange, ...props}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        {...props}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className="hover:bg-slate-600 border-slate-700 border bg-slate-900 rounded px-3"
      >
        <FolderIcon className="w-5 h-5 mx-auto" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const updatedJSON = e.target.files[0];
            if (updatedJSON.type === "application/json") {
              const fileReader = new FileReader();
              fileReader.readAsText(e.target.files[0], "UTF-8");
              fileReader.onload = (e) => {
                const target = e.target;
                const result = target?.result as string;

                try {
                  const project = JSON.parse(result);

                  onChange(project);
                } catch {}
              };
            }
          }
        }}
      />
    </>
  );
};
