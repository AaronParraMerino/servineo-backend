import { Schema, model, models, Document, Types } from 'mongoose';

export interface IForumComment extends Document {
  _id: Types.ObjectId;
  forumId: Types.ObjectId;

  authorId: Types.ObjectId;
  authorName: string;
  authorRole: 'requester' | 'fixer' | 'visitor' | 'admin';

  contenido: string;

  createdAt: Date;
  updatedAt: Date;
}

const forumCommentSchema = new Schema<IForumComment>(
  {
    forumId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'Forum',
    },
    authorId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'User',
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorRole: {
      type: String,
      enum: ['requester', 'fixer', 'visitor', 'admin'],
      required: true,
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: 'forum_comments',
    timestamps: true,
  },
);

export const ForumComment =
  models.ForumComment || model<IForumComment>('ForumComment', forumCommentSchema);
