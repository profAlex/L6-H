import { Request, Response, NextFunction, json } from "express";
import { ObjectId } from "mongodb";
import { HttpStatus } from "../../common/http-statuses/http-statuses";
import {
    postsCollection,
    bloggersCollection,
    usersCollection,
    commentsCollection,
} from "../../db/mongo.db";
import { CollectionNames, Collections } from "../../db/collection-names";

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

// функция validateId непосредствено занимается проверкой наличия Id в соответствующей коллекции
async function validateId(
    sentId: string | undefined,
    collectionName: string,
    res: Response,
): Promise<boolean> {
    // console.warn("<-------LOOK ID: ", sentId);
    if (!sentId) {
        res.status(HttpStatus.BadRequest).json({
            error: "ID parameter is required",
        });
        return false;
    }
    // console.warn("<-------LOOK ID_2: ", sentId);
    if (!ObjectId.isValid(sentId)) {
        res.status(HttpStatus.BadRequest).json({
            error: `Sent ID: ${sentId} is invalid`,
        });
        return false;
    }

    let result;
    try {
        // Create mapping from collection name to collection reference
        const collectionMap: Collections = {
            [CollectionNames.Posts]: postsCollection,
            [CollectionNames.Blogs]: bloggersCollection,
            [CollectionNames.Users]: usersCollection,
            [CollectionNames.Comments]: commentsCollection,
        };

        if (!(collectionName in collectionMap)) {
            res.status(HttpStatus.InternalServerError).json({
                error: `Collection ${collectionName} is of incorrect name`,
            });
            return false;
        }

        // Get the collection reference from the map
        const collectionRef =
            collectionMap[collectionName as keyof typeof collectionMap];

        // If collection reference doesn't exist, return false
        if (!collectionRef) {
            res.status(HttpStatus.NotFound).json({
                error: `Collection ${collectionName} not found`,
            });
            return false;
        }

        // Query the collection
        result = await collectionRef.findOne(
            { _id: new ObjectId(sentId) },
            { projection: { _id: 1 } },
        );

        if (!result) {
            res.status(HttpStatus.NotFound).json({
                error: `ID ${sentId} not found`,
            });
            return false;
        }

        // console.warn("<-------ID WAS FOUND!!");

        return true;
    } catch (err) {
        res.status(HttpStatus.InternalServerError).json({
            error: "Internal server error during ID validation",
        });
        return false;
    }
}
