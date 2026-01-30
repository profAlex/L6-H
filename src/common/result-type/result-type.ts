import { HttpStatus } from "../http-statuses/http-statuses";

export type Result<InheretedDataType = null> = {
    data?: InheretedDataType;
    statusCode: HttpStatus;
    statusDescription?: string;
    errorsMessages: [{ field: string | null; message: string | null }];
};
