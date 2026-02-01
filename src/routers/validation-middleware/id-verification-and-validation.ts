import { Request, Response, NextFunction, json } from "express";
import { ObjectId } from "mongodb";
import { HttpStatus } from "../../common/http-statuses/http-statuses";
import {
    postsCollection,
    bloggersCollection,
    usersCollection,
} from "../../db/mongo.db";

export function createIdValidator(
    paramKey: string, // например, "postId"
    collectionName: string, // например, "postsCollection"
) {
    return async (
        req: Request, // используем стандартный Request из Express
        res: Response,
        next: NextFunction,
    ) => {
        const sentId = req.params[paramKey]; // динамический доступ

        if (await validateId(sentId, collectionName, res)) {
            next();
        }
    };
}

// функция validateId принимает db как параметр
async function validateId(
    sentId: string | undefined,
    collectionName: string,
    res: Response,
): Promise<boolean> {
    if (!sentId) {
        res.status(HttpStatus.BadRequest).json({
            error: "ID parameter is required",
        });
        return false;
    }

    if (!ObjectId.isValid(sentId)) {
        res.status(HttpStatus.BadRequest).json({
            error: `Sent ID: ${sentId} is invalid`,
        });
        return false;
    }

    let result;
    try {
        if (collectionName === "bloggersCollection") {
            result = await bloggersCollection.findOne(
                { _id: new ObjectId(sentId) },
                { projection: { _id: 1 } },
            );
        } else if (collectionName === "postsCollection") {
            result = await postsCollection.findOne(
                { _id: new ObjectId(sentId) },
                { projection: { _id: 1 } },
            );
        } else if (collectionName === "usersCollection") {
            result = await usersCollection.findOne(
                { _id: new ObjectId(sentId) },
                { projection: { _id: 1 } },
            );
        } else {
            result = null;
        }

        if (!result) {
            res.status(HttpStatus.NotFound).json({
                error: `ID ${sentId} not found`,
            });
            return false;
        }

        return true;
    } catch (err) {
        res.status(HttpStatus.InternalServerError).json({
            error: "Internal server error during ID validation",
        });
        return false;
    }
}
