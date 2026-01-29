import { dataQueryRepository } from "../repository-layers/query-repository-layer/query-repository";
import { bcryptService } from "../adapters/authentication/bcrypt-service";
import { jwtService } from "../adapters/verification/jwt-service";
import { Result } from "../common/result-type/result-type";
import { JwtPayloadType } from "../adapters/verification/payload-type";
import { HttpStatus } from "../common/http-statuses/http-statuses";
import { token } from "../adapters/verification/token-type";

export const authService = {
    async loginUser(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<token>> {
        const user = await dataQueryRepository.findByLoginOrEmail(loginOrEmail);

        if (!user)
            return {
                data: null,
                statusCode: HttpStatus.NotFound,
                statusDescription: "Wrong login or password", // по сути это "User does not exist", но на фронт такие детали не должны утекать
                errorMetaData: [
                    {
                        field: "dataQueryRepository.findByLoginOrEmail", // это служебная и отладочная информация, к ней НЕ должен иметь доступ фронтенд, обрабатываем внутри периметра работы бэкэнда
                        message: "User does not exist",
                    },
                ],
            } as Result<token>;

        const isCorrectCredentials = await this.checkUserCredentials(
            password,
            user.passwordHash,
        );

        if (isCorrectCredentials === false) {
            return {
                data: null,
                statusCode: HttpStatus.Unauthorized,
                statusDescription: "Wrong login or password",
                errorMetaData: [
                    {
                        field: "loginUser -> checkUserCredentials",
                        message: "Wrong login or password",
                    },
                ],
            } as Result<token>;
        } else if (isCorrectCredentials === null) {
            return {
                data: null,
                statusCode: HttpStatus.InternalServerError,
                statusDescription:
                    "Failed attempt to check credentials login or password",
                errorMetaData: [
                    {
                        field: "loginUser -> checkUserCredentials",
                        message:
                            "Failed attempt to check credentials login or password",
                    },
                ],
            } as Result<token>;
        }

        const resultedToken = await jwtService.createToken({ userId: user.id });

        return resultedToken;
    },

    async checkUserCredentials(
        password: string,
        passwordHash: string,
    ): Promise<boolean | null> {
        return bcryptService.checkPassword(password, passwordHash);
    },
};
