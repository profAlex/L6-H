// import dotenv from "dotenv";
// dotenv.config();

import "dotenv/config";

// дефолтные значения параметров
const DEFAULT_PORT = "3003";

// структура конфигурационных значений
type Config = {
    appPort: number;
    jwtSecret: string;
};

// парсинг значений
const getConfig = (): Config => {
    let appPort = process.env.PORT;
    let jwtSecret = process.env.JWT_SECRET;

    // валидация
    if (!appPort) {
        console.warn(
            `PORT is not defined in .env! Applied default port number ${DEFAULT_PORT}.`,
        );
        appPort = DEFAULT_PORT;
    }
    //
    // if (!jwtSecret) {
    //   console.warn("JWT_SECRET is not defined in .env! Applied default port number 3003.");
    //   jwtSecret = "3003";
    // }
    if (!jwtSecret) throw new Error("JWT_SECRET is required in .env");

    return {
        appPort: parseInt(appPort, 10),
        jwtSecret,
    };
};

export const envConfig = getConfig();
