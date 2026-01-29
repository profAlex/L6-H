// import { JwtPayloadType } from "../../adapters/payload-type";

export type Result<InheretedDataType = null> = {
    data?: InheretedDataType;
    errorDescription?: string;
    errorCode?: string;
};

// let testResult: Result<JwtPayloadType> = { data: { userId: "testId" } };
// console.log(testResult);
