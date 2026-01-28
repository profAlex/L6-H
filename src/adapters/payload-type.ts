import { UserIdType } from "../routers/router-types/user-id-type";

export type JwtPayloadType = UserIdType & {
    iat: number;
    exp: number;
};
