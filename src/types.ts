export type Todo = {
  id: string;
  text: string;
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
