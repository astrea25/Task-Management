
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: Timestamp;
  priority: "low" | "medium" | "high";
  dueDate?: Timestamp | null;
}

export interface NewTodo {
  text: string;
  priority: "low" | "medium" | "high";
  dueDate?: Date | null;
}

export const addTodo = async (userId: string, newTodo: NewTodo) => {
  const todoCollection = collection(db, "todos");
  const todoData = {
    text: newTodo.text,
    completed: false,
    userId,
    createdAt: serverTimestamp(),
    priority: newTodo.priority,
    dueDate: newTodo.dueDate ? Timestamp.fromDate(newTodo.dueDate) : null,
  };
  
  const docRef = await addDoc(todoCollection, todoData);
  return { id: docRef.id, ...todoData };
};

export const getTodos = async (userId: string) => {
  const todoCollection = collection(db, "todos");
  
  try {
    const todoQuery = query(
      todoCollection,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(todoQuery);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        completed: data.completed,
        userId: data.userId,
        createdAt: data.createdAt,
        priority: data.priority,
        dueDate: data.dueDate || null,
      } as Todo;
    });
  } catch (error: any) {
    if (error.code === "failed-precondition" && error.message.includes("index")) {
      console.warn("Index not created yet, using fallback query without ordering");
      toast("Optimized queries require a Firestore index. Check the console for details.", {
        description: "Using a simplified query for now."
      });
      
      const simpleQuery = query(
        todoCollection,
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(simpleQuery);
      const todos = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          completed: data.completed,
          userId: data.userId,
          createdAt: data.createdAt,
          priority: data.priority,
          dueDate: data.dueDate || null,
        } as Todo;
      });
      
      return todos.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
    }
    
    throw error;
  }
};

export const updateTodoStatus = async (todoId: string, completed: boolean) => {
  const todoDoc = doc(db, "todos", todoId);
  await updateDoc(todoDoc, { completed });
};

export const updateTodoText = async (todoId: string, text: string) => {
  const todoDoc = doc(db, "todos", todoId);
  await updateDoc(todoDoc, { text });
};

export const updateTodoPriority = async (todoId: string, priority: "low" | "medium" | "high") => {
  const todoDoc = doc(db, "todos", todoId);
  await updateDoc(todoDoc, { priority });
};

export const updateTodoDueDate = async (todoId: string, dueDate: Date | null) => {
  const todoDoc = doc(db, "todos", todoId);
  await updateDoc(todoDoc, { 
    dueDate: dueDate ? Timestamp.fromDate(dueDate) : null 
  });
};

export const deleteTodo = async (todoId: string) => {
  const todoDoc = doc(db, "todos", todoId);
  await deleteDoc(todoDoc);
};
