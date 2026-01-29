import { dataQueryRepository } from "../repository-layers/query-repository-layer/query-repository";
import { bcryptService } from "../adapters/authentication/bcrypt-service";
import { jwtService } from "../adapters/verification/jwt-service";

export const authService = {
    async loginUser(
        loginOrEmail: string,
        password: string,
    ): Promise<{ accessToken: string } | null> {
        const isCorrectCredentials = await this.checkUserCredentials(
            loginOrEmail,
            password,
        );

        if (!isCorrectCredentials) {
            return null;
        }

        const token = await jwtService.createToken();

        return { token };
    },

    async checkUserCredentials(
        loginOrEmail: string,
        password: string,
    ): Promise<boolean> {
        const user = await dataQueryRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) return false;

        return bcryptService.checkPassword(password, user.passwordHash);
    },
};
