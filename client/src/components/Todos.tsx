import axios from "axios";
import { TodoCard } from "./TodoCard";
import { Todo } from "../common/types/todo.interface";
import { AddTodo } from "./AddTodo";
import { useQuery } from "@tanstack/react-query";

export function Todos() {

  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos
  });

  async function getTodos() {
    const { data } = await axios.get<Todo[]>("/api/todos");
    return data;
  }

  return (
    <>
      <div className="todo-container">
        {todos?.map((todo, index) => (
          <TodoCard todo={todo} index={index} key={todo.id} />
        ))}
      </div>
      <AddTodo />
    </>
  );
}
