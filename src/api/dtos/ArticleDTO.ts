import { Example } from "tsoa";

export class CreateArticleDTO {
  @Example("How AI is Changing the World")
  title!: string;

  @Example("Artificial Intelligence is transforming industries...")
  content!: string;

  @Example(["tech", "ai", "innovation"])
  tags?: string[];

  @Example("60f7f0a5b6f7c9a3d8b12345")
  author!: string;
  
  @Example("https://example.com/article")
  url?: string;
}

export class UpdateArticleDTO {
  @Example("Updated Article Title")
  title?: string;

  @Example("Updated article content goes here...")
  content?: string;

  @Example(["science", "research"])
  tags?: string[];
}


export class ArticleResponseDTO {
  @Example("64e9b5d2f1b2c3d4e5f6a7b8")
  id!: string;

  @Example("How to Build a Content Aggregator")
  title!: string;

  @Example("This article explains how to build a smart content aggregator...")
  content!: string;

  @Example(["tech", "nodejs", "aggregator"])
  tags!: string[];

  @Example("64e9a1b2c3d4e5f6a7b8c9d0")
  author!: string;

  @Example(123)
  views!: number;

  @Example("2025-09-01T12:34:56.000Z")
  createdAt!: string;

  @Example("2025-09-01T12:34:56.000Z")
  updatedAt!: string;
}
