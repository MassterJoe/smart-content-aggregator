import ArticleModel from "../models/Article";
import { CreateArticleDTO, UpdateArticleDTO, ArticleResponseDTO } from "../dtos/ArticleDTO";
import { Service } from "typedi";

@Service()
class ArticleService {
  public async createArticle(userId: string, dto: CreateArticleDTO): Promise<ArticleResponseDTO> {
    const article = new ArticleModel({
      title: dto.title,
      content: dto.content,
      tags: dto.tags,
      author: userId, 
      url: dto.url,
    });

    const saved = await article.save();

    return {
      id: saved._id.toString(),
      title: saved.title,
      content: saved.content,
      tags: saved.tags,
      author: saved.author.toString(),
      views: saved.views ?? 0,
      createdAt: saved.createdAt.toISOString(),
      updatedAt: saved.updatedAt.toISOString(),
    };
  }

  public async updateArticle(id: string, dto: UpdateArticleDTO): Promise<ArticleResponseDTO | null> {
    const updated = await ArticleModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true }
    );

    if (!updated) return null;

    return {
      id: updated._id.toString(),
      title: updated.title,
      content: updated.content,
      tags: updated.tags,
      author: updated.author.toString(),
      views: updated.views ?? 0,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  public async getArticleById(id: string) {
    return ArticleModel.findById(id).exec();
  }

  public async getAllArticles(): Promise<ArticleResponseDTO[]> {
  const articles = await ArticleModel.find().exec();

  return articles.map(article => ({
    id: article._id.toString(),
    title: article.title,
    content: article.content,
    tags: article.tags,
    author: article.author.toString(),
    views: article.views ?? 0,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }));
}

}

export default ArticleService;
