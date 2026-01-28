"use strict";
// import dotenv from "dotenv";
// dotenv.config();
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
require("dotenv/config");
// дефолтные значения параметров
const DEFAULT_PORT = "3003";
// парсинг значений
const getConfig = () => {
    let appPort = process.env.PORT;
    let jwtSecret = process.env.JWT_SECRET;
    // валидация
    if (!appPort) {
        console.warn(`PORT is not defined in .env! Applied default port number ${DEFAULT_PORT}.`);
        appPort = DEFAULT_PORT;
    }
    //
    // if (!jwtSecret) {
    //   console.warn("JWT_SECRET is not defined in .env! Applied default port number 3003.");
    //   jwtSecret = "3003";
    // }
    if (!jwtSecret)
        throw new Error("JWT_SECRET is required in .env");
    return {
        appPort: parseInt(appPort, 10),
        jwtSecret,
    };
};
exports.envConfig = getConfig();
