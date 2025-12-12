"use server";

import * as jose from 'jose';
import { cookies } from 'next/headers';

// NOTE: Get the secret from your environment variables. 
// You must ensure this matches the backend secret key.
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Retrieves and decodes the authenticated User ID from the JWT 'token' cookie.
 * @returns The User ID (number) or null if unauthenticated.
 */
export async function getAuthenticatedUserId(): Promise<number | null> {
    try {
        // 1. Get the token from the cookie store (name is 'token')
        const token = (await cookies()).get('token')?.value;

        if (!token) {
            return null;
        }

        // 2. Decode and verify the token
        const { payload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET),
            {
                algorithms: ['HS256', 'HS512'],
            }
        );

        // 3. Extract the User ID
        // The ID should be cast to a Number, matching the backend entity.
        // The ID is typically stored in the 'sub' (subject) or 'id' claim.
        // We'll prioritize 'id', falling back to 'sub' if present.
        const userId = (payload.id || payload.sub) as number;

        return userId || null;

    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}