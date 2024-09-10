export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export interface LikesInfo {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
}

export interface CommentInstance {
    _id: string;
    content: string;
    commentatorInfo: {
      userId: string,
      userLogin: string
    };
    postId: string;
    createdAt: string;
    likesInfo: LikesInfo
}
