import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp;
}

// Función helper para verificar que db está disponible
function getDb() {
  if (!db) {
    throw new Error("Firebase no está inicializado. Asegúrate de que las variables de entorno estén configuradas.");
  }
  return db;
}

// Crear una nueva tarea
export async function createTodo(text: string): Promise<string> {
  try {
    const firestoreDb = getDb();
    const docRef = await addDoc(collection(firestoreDb, "todos"), {
      text,
      completed: false,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    throw error;
  }
}

// Obtener todas las tareas
export async function getTodos(): Promise<Todo[]> {
  try {
    const firestoreDb = getDb();
    const q = query(collection(firestoreDb, "todos"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const todos: Todo[] = [];
    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data(),
      } as Todo);
    });
    return todos;
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    throw error;
  }
}

// Actualizar una tarea
export async function updateTodo(
  id: string,
  updates: Partial<Omit<Todo, "id" | "createdAt">>
): Promise<void> {
  try {
    const firestoreDb = getDb();
    const todoRef = doc(firestoreDb, "todos", id);
    await updateDoc(todoRef, updates);
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    throw error;
  }
}

// Eliminar una tarea
export async function deleteTodo(id: string): Promise<void> {
  try {
    const firestoreDb = getDb();
    const todoRef = doc(firestoreDb, "todos", id);
    await deleteDoc(todoRef);
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    throw error;
  }
}

