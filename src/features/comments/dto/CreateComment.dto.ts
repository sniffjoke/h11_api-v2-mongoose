import {CommentInstance} from "../../../interfaces/comments.interface";

export interface CommentatorInfoInterface {
    userId: string
    userLogin: string
}

export class CreateCommentDto {
    public id: string;
    public content: string;
    public commentatorInfo: CommentatorInfoInterface
    public createdAt: string;

    constructor(model: CommentInstance) {
        this.id = model._id;
        this.content = model.content;
        this.commentatorInfo = model.commentatorInfo;
        this.createdAt = model.createdAt;
    }
}
