import bcrypt from 'bcryptjs';

const salt = process.env.SALT || 10;

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, salt);
}

export const comparePassword = (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
}