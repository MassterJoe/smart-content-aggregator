import mongoose, { Document, Schema } from "mongoose";

export type InteractionType =
  | "like"
  | "love"
  | "angry"
  | "sad"
  | "comment"
  | "share"
  | "bookmark"
  | "view";

export interface IInteraction extends Document {
  _id: mongoose.Types.ObjectId; 
  user: mongoose.Types.ObjectId;
  article: mongoose.Types.ObjectId;
  type: InteractionType;
  commentText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InteractionSchema: Schema<IInteraction> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "like",
        "love",
        "angry",
        "sad",
        "comment",
        "share",
        "bookmark",
        "view",
      ],
      required: true,
    },
    commentText: {
      type: String,
      required: function (this: IInteraction) {
        return this.type === "comment";
      },
    },
  },
  { timestamps: true }
);


InteractionSchema.index({ user: 1, article: 1, type: 1 }, { unique: true });

const Interaction = mongoose.model<IInteraction>(
  "Interaction",
  InteractionSchema
);

export default Interaction;
