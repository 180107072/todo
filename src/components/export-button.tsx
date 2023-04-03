import {FC, ComponentProps, memo} from "react";
import {ExportIcon} from "./icons";
import {downloadFile} from "../utils";

export const ExportButton: FC<
  ComponentProps<"button"> & {download: any; fileName: string}
> = memo(({download, fileName, ...props}) => {
  const exportToJson = () => {
    //{...project, todos}
    downloadFile({
      data: JSON.stringify(download),
      fileName: `${fileName}.json`,
      fileType: "text/json",
    });
  };

  return (
    <button
      {...props}
      onClick={exportToJson}
      className="hover:bg-slate-600 border-slate-700 border bg-slate-900 disabled:text-slate-500 rounded px-3"
    >
      <ExportIcon className="w-5 h-5 mx-auto" />
    </button>
  );
});
