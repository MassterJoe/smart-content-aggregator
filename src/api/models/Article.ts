import mongoose, { Document, Schema } from "mongoose";

export interface IArticle extends Document {
  _id: mongoose.Types.ObjectId;   // 👈 explicitly type _id
  title: string;
  content: string;
  summary: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Article = mongoose.model<IArticle>("Article", ArticleSchema);

export default Article;
