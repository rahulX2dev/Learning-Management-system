import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

// Generate JWT token
export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// Get Data from Token
export const getDataFromToken = (request: NextRequest | Request): string => {
    try {
        // Handle both NextRequest (cookies.get) and standard Request (headers.get('cookie'))
        let token = '';

        if ('cookies' in request && typeof request.cookies.get === 'function') {
            token = request.cookies.get('token')?.value || '';
        } else {
            // Fallback for standard Request object if needed, though Next.js usually provides NextRequest
            const cookieHeader = request.headers.get('cookie');
            if (cookieHeader) {
                const cookies = cookieHeader.split(';').reduce((acc: any, cookie) => {
                    const [key, value] = cookie.trim().split('=');
                    acc[key] = value;
                    return acc;
                }, {});
                token = cookies['token'] || '';
            }
        }

        if (!token) {
            throw new Error('Token not found');
        }

        const decodedToken: any = jwt.verify(token, JWT_SECRET);
        return decodedToken.userId;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
