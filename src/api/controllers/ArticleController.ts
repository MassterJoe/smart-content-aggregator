import { Body, Controller, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";
import { Inject, Service } from "typedi";
import ArticleService from "../services/ArticleService";
import { CreateArticleDTO, UpdateArticleDTO, ArticleResponseDTO } from "../dtos/ArticleDTO";
import { successResponse } from "../helpers/responseHandlers";

@Route("articles")
@Tags("Articles")
@Service()
export class ArticleController extends Controller {
  constructor(@Inject() private articleService: ArticleService) {
    super();
  }

  @Post("/{userId}")
  public async createArticle(
    @Path() userId: string, // ✅ for now we take userId from path
    @Body() body: CreateArticleDTO
  ): Promise<ArticleResponseDTO> {
    return this.articleService.createArticle(userId, body);
  }

  @Put("/{id}")
  public async updateArticle(
    @Path() id: string,
    @Body() body: UpdateArticleDTO
  ): Promise<ArticleResponseDTO | null> {
    return this.articleService.updateArticle(id, body);
  }

  @Get("/{id}")
@SuccessResponse("200", "Article retrieved successfully")
  
  public async getArticle(@Path() id: string): Promise<ArticleResponseDTO | null> {
    const article = await this.articleService.getArticleById(id);
    if (!article) return null;

    const data = {
      id: article._id.toString(),
      title: article.title,
      content: article.content,
      tags: article.tags,
      author: article.author.toString(),
      views: article.views ?? 0,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    };

    this.setStatus(200);
    return data;
  }

  /**
   * Get all articles
   */
  @Get("/")
  public async getAllArticles(): Promise<any> {
    const articles = await this.articleService.getAllArticles();

    return successResponse("Articles retrieved successfully", 200, articles);
  }

   /**
   * Get article recommendations for a user
   */
  @Get("/recommendations/{userId}")
  public async getRecommendations(
    @Path() userId: string
  ): Promise<ArticleResponseDTO[]> {
    return this.articleService.getRecommendations(userId);
  }
}
