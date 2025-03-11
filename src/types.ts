export type Todo = {
  id: number;
  title: string;
  isCompleted: boolean;
};

export type TodoData = {
  payload: Todo[];
  meta: {
    allTodosCount: number;
    completedTodosCount: number;
    activeTodosCount: number;
    maxPages: number;
  };
};
