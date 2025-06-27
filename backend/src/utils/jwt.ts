import jwt from "jsonwebtoken";


export const generateToken = (data: Record<string, any>) => {
    return jwt.sign({ data }, process.env.JWT_SECRET!, { expiresIn: '3h' })
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!)
}