import { Request, Response } from "express";
import { LoginInputModel } from "../router-types/login-input-model";
import { authService } from "../../service-layer(BLL)/auth-service";
import { HttpStatus } from "../../common/http-statuses/http-statuses";
import { Result } from "../../common/result-type/result-type";
import { token } from "../../adapters/verification/token-type";

export const attemptToLogin = async (
    req: Request<{}, {}, LoginInputModel, {}>,
    res: Response,
) => {
    const { loginOrEmail, password } = req.body;
    const loginResult: Result<token> = await authService.loginUser(
        loginOrEmail,
        password,
    );

    if (!loginResult.data)
        return res
            .status(loginResult.statusCode)
            .send(loginResult.errorMetaData);

    return res.status(loginResult.statusCode).send(loginResult.data); // статус 204 не предполагает наличие тела ответа. но без send() совсем - роут виснет, поэтому можно дать .end() в конце. А еще можно использовать метод sendStatus
};
