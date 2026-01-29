import jwt from "jsonwebtoken";
import { envConfig } from "../../config";
import { JwtPayloadType } from "./payload-type";
import { token } from "./token-type";
import { HttpStatus } from "../../common/http-statuses/http-statuses";
import { Result } from "../../common/result-type/result-type";

export const jwtService = {
    async createToken(payload: JwtPayloadType): Promise<Result<token>> {
        if (!payload.userId) {
            console.error(
                "Failed attempt to check credentials login or password",
            );

            return {
                data: null,
                statusCode: HttpStatus.InternalServerError,
                statusDescription:
                    "Failed attempt to check credentials login or password",
                errorMetaData: [
                    {
                        field: "createToken -> if (!payload.userId)",
                        message: "userId is empty",
                    },
                ],
            } as Result<token>;
        }

        try {
            const resultedToken = jwt.sign(payload, envConfig.jwtSecret, {
                expiresIn: envConfig.jwtExpiresIn,
            });

            return {
                data: resultedToken,
                statusCode: HttpStatus.NoContent,
                errorMetaData: [{ field: null, message: null }],
            };
        } catch (e: unknown) {
            console.error("Can't sign with JWT service: ", e);
            return {
                data: null,
                statusCode: HttpStatus.InternalServerError,
                statusDescription:
                    "Failed attempt to check credentials login or password",
                errorMetaData: [
                    {
                        field: "createToken -> jwt.sign()",
                        message:
                            "Unknown error while attempting to sign payload",
                    },
                ],
            } as Result<token>;
        }
    },

    async decodeToken(token: string): Promise<JwtPayloadType | null> {
        try {
            return jwt.decode(token) as JwtPayloadType;
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
