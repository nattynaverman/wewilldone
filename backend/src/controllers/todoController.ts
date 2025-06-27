import { Request, Response } from "express";
import {
  getUserTodos,
  getUserTodoDo,
  getUserTodoDone,
  createUserTodo,
  updateUserTodo,
  deleteUserTodo,
} from "../services/todoService";

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "User not authenticated" });
      return;
    }

    const todos = await getUserTodos(userId);
    res.status(200).json({ success: true, data: todos });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

export const getTodosPending = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "User not authenticated" });
      return;
    }

    const todos = await getUserTodoDo(userId);
    res.status(200).json({ success: true, data: todos });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

export const getTodosCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "User not authenticated" });
      return;
    }

    const todos = await getUserTodoDone(userId);
    res.status(200).json({ success: true, data: todos });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { title } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, error: "User not authenticated" });
      return;
    }

    if (!title) {
      res.status(400).json({ success: false, error: "Title is required" });
      return;
    }

    const todo = await createUserTodo(userId, title);
    res.status(201).json({ success: true, data: todo });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { id: todoId } = req.params;
    const { title, completed } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, error: "User not authenticated" });
      return;
    }

    if (!todoId) {
      res.status(400).json({ success: false, error: "Todo ID is required" });
      return;
    }

    const updateData: { title?: string; completed?: boolean } = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ success: false, error: "No data to update" });
      return;
    }

    const todo = await updateUserTodo(userId, todoId, updateData);
    res.status(200).json({ success: true, data: todo });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { id: todoId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, error: "User not authenticated" });
      return;
    }

    if (!todoId) {
      res.status(400).json({ success: false, error: "Todo ID is required" });
      return;
    }

    await deleteUserTodo(userId, todoId);
    res
      .status(200)
      .json({ success: true, message: "Todo deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};
