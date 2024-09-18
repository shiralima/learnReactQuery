import { clsx } from "clsx";
import axios from "axios";
import { Todo } from "../common/types/todo.interface";
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface TodoCardProps {
  todo: Todo;
  index: number;
}

export function TodoCard(props: TodoCardProps) {
  const disabled = props.todo.id <= 0;

  const queryClient = useQueryClient();

  const { mutate: deleteMutate } = useMutation({
    mutationKey: ["todos"],
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.setQueryData(["todos"], (prev: Todo[]) => {
        return prev.filter((_, idx) => idx !== props.index);
      });
    }
  });

  const { mutate: checkMutate } = useMutation({
    mutationKey: ["todos"],
    mutationFn: checkTodo,
    onSuccess: () => {
      queryClient.setQueryData(["todos"], (prev: Todo[]) => {
        return prev.map((todo, idx) => {
          if (idx === props.index) {
            // Toggle the completion status of the todo item
            return { ...todo, completed: isChecked };
          }
          return todo;
        });
      });
    }
  });

  async function checkTodo(isChecked: boolean) {
    await axios.put(`/api/todos/${props.todo.id}`, {
      completed: isChecked,
    });
    return { id: props.todo.id, completed: isChecked };
  }
  //   props.setTodos((prev) => {
  //     const newTodo = [...prev];
  //     newTodo.splice(props.index, 1, {
  //       ...prev[props.index],
  //       completed: isChecked,
  //     });
  //     return newTodo;
  //   });
  // }

  async function deleteTodo() {
    await axios.delete(`/api/todos/${props.todo.id}`);
  }

  function handleTodoClick(event: React.ChangeEvent<HTMLInputElement>) {
    checkMutate(event.currentTarget.checked);
  }

  return (
    <div className={clsx("todo-card", disabled && "disabled")}>
      <input
        type="checkbox"
        className="todo-completed"
        checked={props.todo.completed}
        onChange={handleTodoClick}
        disabled={disabled}
      />

      <p className={clsx("todo-text", props.todo.completed && "completed")}>
        {props.todo.body}
      </p>

      <button onClick={() => deleteMutate()}>Delete</button>
    </div>
  );
}
