import axios from "axios";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function AddTodo() {
  const bodyRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newTodo = bodyRef.current!.value;
      const { data: newId } = await axios.post<number>("/api/todos", {
        newTodo,
      });
      bodyRef.current!.value = "";

      return newId;

    } catch (err) {
      alert("אירעה שגיאה...");
    }
  };


  const { mutate } = useMutation({
    mutationKey: ["todos"],
    mutationFn: handleAddTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] })
  })

  return (
    <form className="add-todo" onSubmit={mutate}>
      <h2>New TODO</h2>

      <div className="body-container">
        <label htmlFor="body" className="body-label">
          TODO content:
        </label>
        <input
          id="body"
          name="body"
          className="body-input"
          required
          ref={bodyRef}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
