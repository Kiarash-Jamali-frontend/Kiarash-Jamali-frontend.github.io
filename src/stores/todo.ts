import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TodoColor = 
    | "blue" 
    | "red" 
    | "green" 
    | "yellow" 
    | "purple" 
    | "pink" 
    | "orange" 
    | "teal" 
    | "indigo" 
    | "rose"
    | null;

export type Todo = {
    id: string;
    text: string;
    completed: boolean;
    pinned: boolean;
    color: TodoColor;
    createdAt: string;
};

export type TodoState = {
    todos: Todo[];
};

export type TodoActions = {
    addTodo: (text: string, color?: TodoColor) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    togglePin: (id: string) => void;
    updateTodoText: (id: string, text: string) => void;
};

const useTodoStore = create<TodoState & TodoActions>()(
    persist(
        (set) => ({
            todos: [],
            addTodo: (text, color = null) => {
                const newTodo: Todo = {
                    id: crypto.randomUUID(),
                    text: text.trim(),
                    completed: false,
                    pinned: false,
                    color,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    todos: [...state.todos, newTodo],
                }));
            },
            toggleTodo: (id) => {
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === id ? { ...todo, completed: !todo.completed } : todo
                    ),
                }));
            },
            deleteTodo: (id) => {
                set((state) => ({
                    todos: state.todos.filter((todo) => todo.id !== id),
                }));
            },
            togglePin: (id) => {
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === id ? { ...todo, pinned: !todo.pinned } : todo
                    ),
                }));
            },
            updateTodoText: (id, text) => {
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === id ? { ...todo, text: text.trim() } : todo
                    ),
                }));
            },
        }),
        {
            name: "todo-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useTodoStore;
