import {commentsRepository} from "./commentsRepository";
import {Request, Response} from "express";
import {commentsQueryRepository} from "./commentsQueryRepository";
import {commentModel} from "../../models/commentsModel";
import {findBlogsHelper} from "../../helpers/blogsHelper";
import {CreateItemsWithQueryDto} from "../blogs/dto/CreateDataWithQuery.dto";
import {CommentInstance} from "../../interfaces/comments.interface";
import {findCommentsHelper} from "../../helpers/commentsHelper";
import {tokenService} from "../../services/token.service";
import {userModel} from "../../models/usersModel";
import {decode} from "jsonwebtoken";
import {UserInstance} from "../../interfaces/users.interface";
import {likeModel} from "../../models/likesModel";
import {likeFactory} from "../../factorys/likeFactory";

class CommentsController {

    public comments = commentModel

    async getCommentsWithParams(req: Request<any, any, any, any>, res: Response) {
        try {
            const commentsQuery = await findBlogsHelper(req.query)
            const sortedComments = await commentsQueryRepository.commentsSortWithQuery(commentsQuery)
            const commentsQueryData = new CreateItemsWithQueryDto<CommentInstance>(commentsQuery, sortedComments)
            res.status(200).json(commentsQueryData)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getAllCommentsByPostId(req: Request<any, any, any, any>, res: Response) {
        try {
            const commentsQuery = await findCommentsHelper(req.query, req.params.id)
            const sortedComments = await commentsQueryRepository.getAllCommentsByPostId(commentsQuery)
            const commentsQueryData = new CreateItemsWithQueryDto<CommentInstance>(commentsQuery, sortedComments)
            res.status(200).json(commentsQueryData)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async getCommentById(req: Request, res: Response) {
        try {
            const token = tokenService.getToken(req.headers.authorization);
            const decodedToken: any = decode(token)
            const user: UserInstance | null = await userModel.findById(decodedToken?._id)
            const comment = await commentsQueryRepository.commentOutput(req.params.id)
            const likeStatus = await likeModel.findOne({userId: user?._id, commentId: comment.id})
            res.status(200).json({...comment, likesInfo: {...comment.likesInfo, myStatus: likeStatus?.status}})
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async createCommentByPostId(req: Request, res: Response) {
        try {
            const comment = await commentsRepository.createComment(req.body, tokenService.getToken(req.headers.authorization), req.params.id)
            const newComment = commentsQueryRepository.commentMapOutput(comment)
            res.status(201).json(newComment)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async updateCommentById(req: Request, res: Response) {
        try {
            await commentsRepository.updateCommentById(req.params.id, req.body)
            res.status(204).send('Обновлено')
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async updateCommentByIdWithLikeStatus(req: Request, res: Response) {
        try {
            const token = tokenService.getToken(req.headers.authorization);
            const decodedToken: any = decode(token)
            const user: UserInstance | null = await userModel.findById(decodedToken?._id)
            const likeStatus = req.body.likeStatus
            const findedComment = await commentModel.findById(req.params.id)
            const updates = await likeFactory(likeStatus, findedComment!, user!)
            // if (likeStatus === LikeStatus.Like) {
                // const updateCommentStatus = await commentModel.updateOne({_id: req.params.id}, {'likesInfo.likesCount': +1, 'likesInfo.dislikesCount': -1})
                // const updateCommentInfo = await commentModel.updateOne({_id: req.params.id}, {$inc: {'likesInfo.likesCount': 1, 'likesInfo.dislikesCount': -1}})
            // }
            // if (likeStatus === LikeStatus.Dislike) {
                // const updateCommentStatus = await commentModel.updateOne({_id: req.params.id}, {'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': +1})
                // const updateCommentInfo = await commentModel.updateOne({_id: req.params.id}, {$inc: {'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': 1}})
            // }
            res.status(204).send('Обновлено')
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async deleteCommentById(req: Request, res: Response) {
        try {
            await commentsRepository.deleteCommentById(req.params.id)
            res.status(204).send('Удалено');
        } catch (e) {
            res.status(500).send(e)
        }
    }

}

export const commentsController = new CommentsController();
