export type Todo = {
  key: string;
  label: string;
  marked: boolean;
  children: Todo[];
};

export type Project = {
  id: string;
  name: string;
};
