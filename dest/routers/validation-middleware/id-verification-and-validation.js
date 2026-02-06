"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIdValidator = createIdValidator;
const mongodb_1 = require("mongodb");
const http_statuses_1 = require("../../common/http-statuses/http-statuses");
const mongo_db_1 = require("../../db/mongo.db");
function createIdValidator(paramKey, // например, "postId"
collectionName) {
    return (req, // используем стандартный Request из Express
    res, next) => __awaiter(this, void 0, void 0, function* () {
        const sentId = req.params[paramKey]; // динамический доступ
        if (yield validateId(sentId, collectionName, res)) {
            next();
        }
    });
}
// функция validateId непосредствено занимается проверкой наличия Id в соответствующей коллекции
function validateId(sentId, collectionName, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!sentId) {
            res.status(http_statuses_1.HttpStatus.BadRequest).json({
                error: "ID parameter is required",
            });
            return false;
        }
        if (!mongodb_1.ObjectId.isValid(sentId)) {
            res.status(http_statuses_1.HttpStatus.BadRequest).json({
                error: `Sent ID: ${sentId} is invalid`,
            });
            return false;
        }
        let result;
        try {
            if (collectionName === "bloggersCollection") {
                result = yield mongo_db_1.bloggersCollection.findOne({ _id: new mongodb_1.ObjectId(sentId) }, { projection: { _id: 1 } });
            }
            else if (collectionName === "postsCollection") {
                result = yield mongo_db_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(sentId) }, { projection: { _id: 1 } });
            }
            else if (collectionName === "usersCollection") {
                result = yield mongo_db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(sentId) }, { projection: { _id: 1 } });
            }
            else if (collectionName === "commentsCollection") {
                result = yield mongo_db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(sentId) }, { projection: { _id: 1 } });
            }
            else {
                result = null;
            }
            if (!result) {
                res.status(http_statuses_1.HttpStatus.NotFound).json({
                    error: `ID ${sentId} not found`,
                });
                return false;
            }
            return true;
        }
        catch (err) {
            res.status(http_statuses_1.HttpStatus.InternalServerError).json({
                error: "Internal server error during ID validation",
            });
            return false;
        }
    });
}
