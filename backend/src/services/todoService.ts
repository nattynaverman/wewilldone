import { prisma } from "../config/database";

export const getUserTodos = async (userId: string) => {
    return prisma.todo.findMany({
        where: { 
            userId,
            isDeleted: false 
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const getUserTodoDo = async (userId: string) => {
    return prisma.todo.findMany({
        where: { 
            userId,
            completed: false,
            isDeleted: false
        },
        orderBy: { createdAt: 'desc' }
    });
}

export const getUserTodoDone = async (userId: string) => {
    return prisma.todo.findMany({
        where: { 
            userId,
            completed: true,
            isDeleted: false
        },
        orderBy: { createdAt: 'desc' }
    });
}

export const createUserTodo = async (userId: string, title: string) => {
    if (!title || title.trim() === '') {
        throw new Error("Title is required");
    }
    
    return prisma.todo.create({
        data: {
            title: title.trim(),
            userId
        }
    });
};

export const updateUserTodo = async (userId: string, todoId: string, data: {title?: string, completed?: boolean, isDeleted?: boolean}) => {
    const existingTodo = await prisma.todo.findFirst({
        where: {
            id: todoId,
            userId,
            isDeleted: false
        }
    });

    if (!existingTodo) {
        throw new Error("Todo not found or already deleted!");
    }

    const updateData: any = {};
    if (data.title != undefined) {
        updateData.title = data.title.trim();
        if (updateData.title === '') {
            throw new Error("Title cannot be empty!");
        }
    }
    if (data.completed != undefined) {
        updateData.completed = data.completed;
    }
    if (data.isDeleted !== undefined) {
        updateData.isDeleted = data.isDeleted;
    }

    return prisma.todo.update({
        where: { id: todoId },
        data: updateData
    });
};

export const deleteUserTodo = async (userId: string, todoId: string) => {
    return updateUserTodo(userId, todoId, { isDeleted: true });
};