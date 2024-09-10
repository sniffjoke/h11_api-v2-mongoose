import {Router} from "express";
import {commentsController} from "./commentsController";
import {errorExpressValidatorMiddleware} from "../../middlewares/errors/errorExpressValidatorMiddleware";
import {contentCommentValidator, idCommentValidator} from "./validators/commentsValidators";
import {authMiddlewareWithBearer} from "../../middlewares/auth/authMiddlewareWithBearer";
import {isOwnMiddleware} from "../../middlewares/isOwnMiddleware";

const router = Router();

router.route('/')
    .get(
        // idCommentValidator,
        // errorExpressValidatorMiddleware,
        commentsController.getCommentsWithParams
    )

router.route('/:id')
    .get(
        commentsController.getCommentById,
    )
    .put(
        authMiddlewareWithBearer,
        idCommentValidator,
        contentCommentValidator,
        errorExpressValidatorMiddleware,
        isOwnMiddleware,
        commentsController.updateCommentById
    )
    .delete(
        authMiddlewareWithBearer,
        idCommentValidator,
        errorExpressValidatorMiddleware,
        isOwnMiddleware,
        commentsController.deleteCommentById
    )

export default router
