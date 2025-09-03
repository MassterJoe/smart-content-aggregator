import { Example } from "tsoa";

export type InteractionType =
  | "like"
  | "love"
  | "angry"
  | "sad"
  | "comment"
  | "share"
  | "bookmark"
  | "view";

export class CreateInteractionDTO {
  @Example("64e9b5d2f1b2c3d4e5f6a7b8")
  articleId!: string;

  @Example("64e9a1b2c3d4e5f6a7b8c9d0")
  userId!: string;

  @Example("like")
  type!: InteractionType;

  @Example("Great article! Very insightful.")
  comment?: string;
}

export class InteractionResponseDTO {
  @Example("64e9c1b2a3d4f5e6b7c8d9e0")
  id!: string;

  @Example("64e9b5d2f1b2c3d4e5f6a7b8")
  articleId!: string;

  @Example("64e9a1b2c3d4e5f6a7b8c9d0")
  userId!: string;

  @Example("like")
  type!: InteractionType;

  @Example("Great article! Very insightful.")
  comment?: string;

  @Example("2025-09-01T12:34:56.000Z")
  createdAt!: string;

  @Example("2025-09-01T12:34:56.000Z")
  updatedAt!: string;
}
