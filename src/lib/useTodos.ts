"use client";

import { useState, useEffect } from "react";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Todo, createTodo, updateTodo, deleteTodo } from "./todos";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!db) {
      setError("Firebase no está inicializado");
      setLoading(false);
      return;
    }

    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const todosData: Todo[] = [];
        snapshot.forEach((doc) => {
          todosData.push({
            id: doc.id,
            ...doc.data(),
          } as Todo);
        });
        setTodos(todosData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error en la suscripción:", err);
        setError("Error al cargar las tareas");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addTodo = async (text: string) => {
    try {
      setError(null);
      await createTodo(text);
    } catch (err) {
      setError("Error al crear la tarea");
      throw err;
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      setError(null);
      await updateTodo(id, { completed });
    } catch (err) {
      setError("Error al actualizar la tarea");
      throw err;
    }
  };

  const editTodo = async (id: string, text: string) => {
    try {
      setError(null);
      await updateTodo(id, { text });
    } catch (err) {
      setError("Error al actualizar la tarea");
      throw err;
    }
  };

  const removeTodo = async (id: string) => {
    try {
      setError(null);
      await deleteTodo(id);
    } catch (err) {
      setError("Error al eliminar la tarea");
      throw err;
    }
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
  };
}

