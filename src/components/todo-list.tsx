// components/todo-list.tsx
"use client";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

export function TodoList() {
  // Aquí va la lógica y JSX de tu todo-list
  return (
    <div>
      {/* Usa tus componentes UI aquí */}
      <Input type="text" placeholder="Nueva tarea..." />
      <Button>Agregar</Button>
      <Card>
        {/* Lista de tareas */}
      </Card>
    </div>
  );
}