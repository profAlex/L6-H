"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const post_router_description_1 = require("./router-handlers/post-router-description");
const PostInputModel_validation_middleware_1 = require("./validation-middleware/PostInputModel-validation-middleware");
const error_management_validation_middleware_1 = require("./validation-middleware/error-management-validation-middleware");
const base64_auth_guard_middleware_1 = require("./validation-middleware/base64-auth-guard_middleware");
const id_names_1 = require("./util-enums/id-names");
const collection_names_1 = require("../db/collection-names");
const id_verification_and_validation_1 = require("./validation-middleware/id-verification-and-validation");
const pagination_validators_1 = require("./validation-middleware/pagination-validators");
const fields_for_sorting_1 = require("./util-enums/fields-for-sorting");
const token_guard_1 = require("./guard-middleware/token-guard");
exports.postsRouter = (0, express_1.Router)();
const validatePostId = (0, id_verification_and_validation_1.createIdValidator)(id_names_1.IdParamName.PostId, collection_names_1.CollectionNames.Posts);
// creates a comment
exports.postsRouter.post("/:postId/comments", token_guard_1.tokenGuardVerification, validatePostId, error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.createNewComment);
// Returns all posts
exports.postsRouter.get("/", (0, pagination_validators_1.inputPaginationValidatorForPosts)(fields_for_sorting_1.PostsSortListEnum), error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.getSeveralPosts);
// auth guarded, Creates new post
exports.postsRouter.post("/", base64_auth_guard_middleware_1.superAdminGuardMiddleware, PostInputModel_validation_middleware_1.postInputModelValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.createNewPost);
// Return post by post-id
exports.postsRouter.get("/:id", // здесь было просто id
validatePostId, error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.findSinglePost);
// auth guarded, Update existing post by post-id with InputModel
exports.postsRouter.put("/:id", // здесь было просто id
base64_auth_guard_middleware_1.superAdminGuardMiddleware, validatePostId, 
/*inputErrorManagementMiddleware,*/ PostInputModel_validation_middleware_1.postInputModelValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.updatePost);
// auth guarded, Delete post specified by post-id
exports.postsRouter.delete("/:id", // здесь было просто id
base64_auth_guard_middleware_1.superAdminGuardMiddleware, validatePostId, error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.deletePost);
