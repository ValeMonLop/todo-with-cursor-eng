"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { useTodos } from "@/lib/useTodos";
import { Trash2, Edit2, Check, X } from "lucide-react";

export function TodoList() {
  const { todos, loading, error, addTodo, toggleTodo, editTodo, removeTodo } =
    useTodos();
  const [newTodoText, setNewTodoText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      try {
        await addTodo(newTodoText.trim());
        setNewTodoText("");
      } catch (err) {
        console.error("Error al agregar tarea:", err);
      }
    }
  };

  const handleEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const handleSaveEdit = async (id: string) => {
    if (editingText.trim()) {
      try {
        await editTodo(id, editingText.trim());
        setEditingId(null);
        setEditingText("");
      } catch (err) {
        console.error("Error al editar tarea:", err);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await toggleTodo(id, !completed);
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await removeTodo(id);
      } catch (err) {
        console.error("Error al eliminar tarea:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Lista de Tareas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Formulario para agregar tareas */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Escribe una nueva tarea..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!newTodoText.trim()}>
                Agregar
              </Button>
            </form>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Estado de carga */}
            {loading && (
              <div className="text-center py-8 text-muted-foreground">
                Cargando tareas...
              </div>
            )}

            {/* Lista de tareas */}
            {!loading && todos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay tareas. ¡Agrega una nueva tarea para comenzar!
              </div>
            )}

            {!loading && todos.length > 0 && (
              <div className="space-y-2">
                {todos.map((todo) => (
                  <Card
                    key={todo.id}
                    className={`transition-all ${
                      todo.completed
                        ? "opacity-60 bg-muted/50"
                        : "bg-background"
                    }`}
                  >
                    <CardContent className="p-4">
                      {editingId === todo.id ? (
                        <div className="flex gap-2 items-center">
                          <Input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveEdit(todo.id);
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSaveEdit(todo.id)}
                            disabled={!editingText.trim()}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggle(todo.id, todo.completed)}
                            className="h-5 w-5 rounded border-gray-300 cursor-pointer"
                          />
                          <span
                            className={`flex-1 ${
                              todo.completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {todo.text}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(todo.id, todo.text)}
                              disabled={todo.completed}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(todo.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Contador de tareas */}
            {!loading && todos.length > 0 && (
              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                {todos.filter((t) => !t.completed).length} tarea(s) pendiente(s) de{" "}
                {todos.length} total
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}