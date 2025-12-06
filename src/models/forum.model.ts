import { Schema, model, models, Document, Types } from 'mongoose';

export type ForumCategory = 'problemas' | 'servicios' | 'consejos' | 'general';

export interface IForum extends Document {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  authorName: string;
  authorRole: 'requester' | 'fixer' | 'visitor' | 'admin';

  titulo: string;
  descripcion: string;
  categoria: ForumCategory;

  commentsCount: number;
  isLocked: boolean;

  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

const forumSchema = new Schema<IForum>(
  {
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

    titulo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      enum: ['problemas', 'servicios', 'consejos', 'general'],
      required: true,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: 'forums',
    timestamps: true, // createdAt, updatedAt
  },
);

export const Forum = models.Forum || model<IForum>('Forum', forumSchema);
