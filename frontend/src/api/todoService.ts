import apiClient from './client'

export interface Todo {
  id: string
  title: string
  completed: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface TodoResponse {
  success: boolean
  data: Todo[]
}

export interface SingleTodoResponse {
  success: boolean
  data: Todo
}

export interface CreateTodoData {
  title: string
}

export interface UpdateTodoData {
  title?: string
  completed?: boolean
}

// API GET Todos
export const getAllTodos = async (): Promise<TodoResponse> => {
  const response = await apiClient.get('/todos')
  return response.data
}

// API GET Todos Pending
export const getPendingTodos = async (): Promise<TodoResponse> => {
  const response = await apiClient.get('/todos/pending')
  return response.data
}

// API GET Todos Completed
export const getCompletedTodos = async (): Promise<TodoResponse> => {
  const response = await apiClient.get('/todos/completed')
  return response.data
}

// API Post New Todo
export const createTodo = async (data: CreateTodoData): Promise<SingleTodoResponse> => {
  const response = await apiClient.post('/todos', data)
  return response.data
}

// API Update Todo
export const updateTodo = async (id: string, data: UpdateTodoData): Promise<SingleTodoResponse> => {
  const response = await apiClient.put(`/todos/${id}`, data)
  return response.data
}

// API Delete Todo
export const deleteTodo = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/todos/${id}`)
  return response.data
}