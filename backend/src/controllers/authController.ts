import { Request, Response } from "express";
import { createAccount, loginAccount } from "../services/authService";

export const registerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        const result = await createAccount(email, username, password);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { identify, password } = req.body;

        if (!identify || !password) {
            res.status(400).json({ error: 'email/username and password are required' });
            return;
        }

        const result = await loginAccount(identify, password);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};