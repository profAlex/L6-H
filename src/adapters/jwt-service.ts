import jwt from "jsonwebtoken";
import { envConfig } from "../config";
import { JwtPayloadType } from "./payload-type";

export const jwtService = {
    async createToken(payload: JwtPayloadType): Promise<string | null> {
        try {
            return jwt.sign(payload, envConfig.jwtSecret, {
                expiresIn: envConfig.jwtExpiresIn,
            });
        } catch (e: unknown) {
            console.error("Can't sign with JWT service: ", e);
            return null;
        }
    },

    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token with JWT service: ", e);
            return null;
        }
    },

    async verifyToken(token: string): Promise<JwtPayloadType | null> {
        try {
            return jwt.verify(token, envConfig.jwtSecret) as JwtPayloadType;
        } catch (e: unknown) {
            console.error("Token verification with JWT service error: ", e);
            return null;
        }
    },
};
