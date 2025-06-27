import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('Database connect successfully');
    } catch (error) {
        console.log('Database connection faild:', error)
        process.exit(1);
    }
};