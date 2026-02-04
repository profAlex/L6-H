import { Response } from "express";
import { IdParamName } from "../util-enums/id-names";
import { RequestWithParams } from "../request-types/request-types";
import { HttpStatus } from "../../common/http-statuses/http-statuses";
import { dataQueryRepository } from "../../repository-layers/query-repository-layer/query-repository";

export const getCommentById = async (
    req: RequestWithParams<{ [IdParamName.CommentId]: string }>,
    res: Response,
) => {
    const result = await dataQueryRepository.findSingleComment(
        req.params[IdParamName.CommentId],
    );

    if (!result) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    return res.status(HttpStatus.Ok).send(result);
};
