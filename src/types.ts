export type Todo = {
  title: string;
  isCompleted: boolean;
};

export type CommonResponse = void | { message: string };

export type idParams = { id: string };
