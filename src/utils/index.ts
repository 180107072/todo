import {Todo} from "../types";

export const createKey = (todo: Todo) =>
  [
    ...todo.key.split("-"),
    todo.children ? todo.children.length + Math.random() * 10 : 1,
  ].join("-");

export const downloadFile = ({
  data,
  fileName,
  fileType,
}: {
  data: string;
  fileName: string;
  fileType: string;
}) => {
  const blob = new Blob([data], {type: fileType});

  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};
