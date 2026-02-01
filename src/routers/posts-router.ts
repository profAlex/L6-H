import { Request, Response, Router } from "express";
import {
    createNewComment,
    createNewPost,
    deletePost,
    findSinglePost,
    getSeveralPosts,
    updatePost,
} from "./router-handlers/post-router-description";

import { postInputModelValidation } from "./validation-middleware/PostInputModel-validation-middleware";
import { inputErrorManagementMiddleware } from "./validation-middleware/error-management-validation-middleware";
import { superAdminGuardMiddleware } from "./validation-middleware/base64-auth-guard_middleware";
import { IdParamName } from "./util-enums/id-names";
import { CollectionNames } from "../db/collection-names";
import { createIdValidator } from "./validation-middleware/id-verification-and-validation";
import { inputPaginationValidatorForPosts } from "./validation-middleware/pagination-validators";
import { PostsSortListEnum } from "./util-enums/fields-for-sorting";
import { tokenGuardVerification } from "./guard-middleware/token-guard";
import { CommentInputModel } from "./router-types/comment-input-model";
import { RequestWithParamsAndBodyAndUserId } from "./request-types/request-types";
import { UserIdType } from "./router-types/user-id-type";

export const postsRouter = Router();

const validatePostId = createIdValidator(
    IdParamName.PostId,
    CollectionNames.Posts,
);

// creates a comment
postsRouter.post(
    "/:postId/comments",
    tokenGuardVerification,
    validatePostId,
    inputErrorManagementMiddleware,
    createNewComment,
);

// Returns all posts
postsRouter.get(
    "/",
    inputPaginationValidatorForPosts(PostsSortListEnum),
    inputErrorManagementMiddleware,
    getSeveralPosts,
);

// auth guarded, Creates new post
postsRouter.post(
    "/",
    superAdminGuardMiddleware,
    postInputModelValidation,
    inputErrorManagementMiddleware,
    createNewPost,
);

// Return post by post-id
postsRouter.get(
    "/:id", // здесь было просто id
    validatePostId,
    inputErrorManagementMiddleware,
    findSinglePost,
);

// auth guarded, Update existing post by post-id with InputModel
postsRouter.put(
    "/:id", // здесь было просто id
    superAdminGuardMiddleware,
    validatePostId,
    /*inputErrorManagementMiddleware,*/ postInputModelValidation,
    inputErrorManagementMiddleware,
    updatePost,
);

// auth guarded, Delete post specified by post-id
postsRouter.delete(
    "/:id", // здесь было просто id
    superAdminGuardMiddleware,
    validatePostId,
    inputErrorManagementMiddleware,
    deletePost,
);
