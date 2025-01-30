import { addDoc, collection, doc, getDocs, query } from "firebase/firestore";
import { db } from "./fire";

interface Todo {
  id: string
  title: string
  description: string
}

export const createTodo = async (data) => {
  try {
    const docRef = collection(db, "todo");
    const res = await addDoc(docRef, data);
    return { res, status: 200 };
  } catch (error) {
    return error;
  }
};

export const getAllTodo = async (): Promise<{ todos: Todo[], status: number }> => {
  try {
    const todosCol = collection(db, "todo");
    const q = query(todosCol);
    const querySnapshot = await getDocs(q);

    const todos: Todo[] = [];
    querySnapshot.forEach((doc) => {
      todos.push({ id: doc.id, ...doc.data() } as Todo);
    });

    return { todos, status: 200 };
  } catch (error) {
    return { todos: [], status: 500 };
  }
};