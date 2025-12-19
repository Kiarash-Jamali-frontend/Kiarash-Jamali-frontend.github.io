import { useState } from "react";
import Header from "../components/Header";
import useTodoStore, { type Todo, type TodoColor } from "../stores/todo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faCheck,
    faTrash,
    faThumbtack,
    faPalette,
    faEdit,
} from "@fortawesome/free-solid-svg-icons";
import input from "../cva/input";
import { AnimatePresence, motion } from "framer-motion";

const TODO_COLORS: {
    value: TodoColor;
    label: string;
    bgClass: string;
    borderClass: string;
    colorDot: string;
}[] = [
        { value: null, label: "بدون رنگ", bgClass: "bg-secondary", borderClass: "border-zinc-200 dark:border-zinc-700", colorDot: "#9ca3af" },
        { value: "blue", label: "آبی", bgClass: "bg-blue-50 dark:bg-blue-950/30", borderClass: "border-blue-300 dark:border-blue-700", colorDot: "#3b82f6" },
        { value: "red", label: "قرمز", bgClass: "bg-red-50 dark:bg-red-950/30", borderClass: "border-red-300 dark:border-red-700", colorDot: "#ef4444" },
        { value: "green", label: "سبز", bgClass: "bg-green-50 dark:bg-green-950/30", borderClass: "border-green-300 dark:border-green-700", colorDot: "#22c55e" },
        { value: "yellow", label: "زرد", bgClass: "bg-yellow-50 dark:bg-yellow-950/30", borderClass: "border-yellow-300 dark:border-yellow-700", colorDot: "#eab308" },
        { value: "purple", label: "بنفش", bgClass: "bg-purple-50 dark:bg-purple-950/30", borderClass: "border-purple-300 dark:border-purple-700", colorDot: "#a855f7" },
        { value: "pink", label: "صورتی", bgClass: "bg-pink-50 dark:bg-pink-950/30", borderClass: "border-pink-300 dark:border-pink-700", colorDot: "#ec4899" },
        { value: "orange", label: "نارنجی", bgClass: "bg-orange-50 dark:bg-orange-950/30", borderClass: "border-orange-300 dark:border-orange-700", colorDot: "#f97316" },
        { value: "teal", label: "فیروزه‌ای", bgClass: "bg-teal-50 dark:bg-teal-950/30", borderClass: "border-teal-300 dark:border-teal-700", colorDot: "#14b8a6" },
        { value: "indigo", label: "نیلی", bgClass: "bg-indigo-50 dark:bg-indigo-950/30", borderClass: "border-indigo-300 dark:border-indigo-700", colorDot: "#6366f1" },
        { value: "rose", label: "رز", bgClass: "bg-rose-50 dark:bg-rose-950/30", borderClass: "border-rose-300 dark:border-rose-700", colorDot: "#f43f5e" },
    ];

const getColorClasses = (color: TodoColor) => {
    const colorDef = TODO_COLORS.find((c) => c.value === color) || TODO_COLORS[0];
    return { bg: colorDef.bgClass, border: colorDef.borderClass };
};

export default function Todo() {
    const { todos, addTodo, toggleTodo, deleteTodo, togglePin, updateTodoText } = useTodoStore();
    const [newTodoText, setNewTodoText] = useState("");
    const [selectedColor, setSelectedColor] = useState<TodoColor>(null);
    const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    const sortedTodos = [...todos].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const handleAddTodo = () => {
        setShowColorPicker(null);
        if (newTodoText.trim()) {
            addTodo(newTodoText, selectedColor);
            setNewTodoText("");
            setSelectedColor(null);
        }
    };

    const handleStartEdit = (todo: Todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
    };

    const handleSaveEdit = (id: string) => {
        if (editText.trim()) {
            updateTodoText(id, editText);
        }
        setEditingId(null);
        setEditText("");
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText("");
    };

    return (
        <div className="flex flex-col grow">
            <Header />
            <div className="mt-5 flex flex-col grow overflow-auto">
                <h2 className="text-2xl font-bold mb-4">To-Do List</h2>

                {/* Add Todo Form */}
                <div className="mb-6 space-y-3">
                    <div className="flex items-stretch gap-x-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                className={input({ size: "md" })}
                                placeholder="یک کار جدید اضافه کن..."
                                value={newTodoText}
                                onChange={(e) => setNewTodoText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleAddTodo();
                                    }
                                }}
                            />
                            {selectedColor && (
                                <div
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-zinc-300 dark:border-zinc-600"
                                    style={{
                                        backgroundColor: TODO_COLORS.find((c) => c.value === selectedColor)?.colorDot || "#9ca3af",
                                    }}
                                />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowColorPicker(showColorPicker === "new" ? null : "new")}
                            className="w-10 grid place-items-center border rounded-xl bg-secondary hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faPalette} className="text-natural/60" />
                        </button>
                        <button
                            type="button"
                            onClick={handleAddTodo}
                            disabled={!newTodoText.trim()}
                            className="w-10 grid place-items-center bg-primary text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed transition-all"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>

                    {/* Color Picker for New Todo */}
                    <div className="overflow-hidden">
                        <AnimatePresence>
                            {showColorPicker === "new" && (
                                <motion.div initial="hide" animate="show" exit="hide"
                                    variants={{
                                        hide: {
                                            filter: "blur(1rem)",
                                            opacity: 0,
                                            height: "0"
                                        },
                                        show: {
                                            filter: "blur(0px)",
                                            opacity: 1,
                                            height: "auto"
                                        }
                                    }}>
                                    <div className="p-3 bg-secondary border rounded-xl">
                                        <div className="text-xs font-medium mb-2 text-natural/60">انتخاب رنگ:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {TODO_COLORS.map((color) => (
                                                <button
                                                    key={color.value || "none"}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedColor(color.value);
                                                        setShowColorPicker(null);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-x-2 ${selectedColor === color.value
                                                        ? `${color.borderClass} border-2 font-semibold`
                                                        : `${color.borderClass} border`
                                                        } ${color.bgClass}`}
                                                >
                                                    <span
                                                        className="w-3 h-3 rounded-full border border-zinc-300 dark:border-zinc-600"
                                                        style={{ backgroundColor: color.colorDot }}
                                                    />
                                                    {color.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Todos List */}
                <div className="space-y-3 overflow-auto scrollbar-hidden flex-1">
                    {sortedTodos.length === 0 ? (
                        <div className="text-center py-12 text-natural/60">
                            <p className="text-sm">هنوز هیچ کاری اضافه نکردی!</p>
                            <p className="text-xs mt-1">اولین کارتو اضافه کن</p>
                        </div>
                    ) : (
                        sortedTodos.map((todo) => {
                            const { bg, border } = getColorClasses(todo.color);
                            const isEditing = editingId === todo.id;

                            return (
                                <AnimatePresence
                                    key={todo.id}>
                                    <motion.div variants={{
                                        hide: {
                                            opacity: 0,
                                            filter: "blur(1rem)",
                                            transform: "scale(0.75)"
                                        },
                                        show: {
                                            opacity: 1,
                                            filter: "blur(0rem)",
                                            transform: "scale(1)"
                                        }
                                    }} initial="hide" animate="show" exit="hide">
                                        <div
                                            className={`p-4 rounded-xl border ${bg} ${border} transition-all ${todo.pinned ? "ring-2 ring-primary/20" : ""
                                                } ${todo.completed ? "opacity-60" : ""}`}
                                        >
                                            <div className="flex items-start gap-x-3">
                                                {/* Checkbox */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleTodo(todo.id)}
                                                    className={`mt-0.5 size-5 rounded border-2 flex items-center justify-center transition-all ${todo.completed
                                                        ? "bg-primary border-primary"
                                                        : "border-zinc-300 dark:border-zinc-600 hover:border-primary"
                                                        }`}
                                                >
                                                    {todo.completed && (
                                                        <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                                                    )}
                                                </button>

                                                {/* Todo Text */}
                                                <div className="flex-1 min-w-0">
                                                    {isEditing ? (
                                                        <div className="space-y-2">
                                                            <input
                                                                type="text"
                                                                className={input({ size: "md" })}
                                                                value={editText}
                                                                onChange={(e) => setEditText(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        handleSaveEdit(todo.id);
                                                                    } else if (e.key === "Escape") {
                                                                        handleCancelEdit();
                                                                    }
                                                                }}
                                                                autoFocus
                                                            />
                                                            <div className="flex gap-x-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSaveEdit(todo.id)}
                                                                    className="px-2 py-1 text-xs bg-primary text-white rounded-lg"
                                                                >
                                                                    ذخیره
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={handleCancelEdit}
                                                                    className="px-2 py-1 text-xs bg-secondary border rounded-lg"
                                                                >
                                                                    لغو
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p
                                                            className={`text-sm ${todo.completed ? "line-through text-natural/50" : "text-natural"
                                                                }`}
                                                        >
                                                            {todo.text}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                {!isEditing && (
                                                    <div className="flex items-center gap-x-1">
                                                        {/* Pin Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePin(todo.id)}
                                                            className={`p-1.5 rounded-lg transition-colors ${todo.pinned
                                                                ? "text-primary bg-primary/10"
                                                                : "text-natural/40 hover:text-natural/60 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                                                }`}
                                                        >
                                                            <FontAwesomeIcon icon={faThumbtack} className="text-xs" />
                                                        </button>

                                                        {/* Edit Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStartEdit(todo)}
                                                            className="p-1.5 rounded-lg text-natural/40 hover:text-natural/60 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteTodo(todo.id)}
                                                            className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
