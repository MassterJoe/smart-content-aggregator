import ArticleModel from "../models/Article";
import { User } from "../models";
import InteractionModel from "../models/Interaction";
import {generateSummary} from "../helpers/utils"
import { CreateArticleDTO, UpdateArticleDTO, ArticleResponseDTO } from "../dtos/ArticleDTO";
import { Service } from "typedi";
import mongoose from "mongoose";

@Service()
class ArticleService {
  public async createArticle(userId: string, dto: CreateArticleDTO): Promise<ArticleResponseDTO> {
    
    const summary = dto.summary || await generateSummary(dto.content);

    const article = new ArticleModel({
      title: dto.title,
      content: dto.content,
      summary,
      tags: dto.tags,
      author: userId, 
      url: dto.url,
    });

    const saved = await article.save();

    return {
      id: saved._id.toString(),
      title: saved.title,
      content: saved.content,
      summary: saved.summary,
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
   /**
   * Recommend articles for a user based on interests and popularity
   */
  public async getRecommendations(userId: string, limit: number = 5): Promise<ArticleResponseDTO[]> {
    // 1️⃣ Fetch user interests
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const userInterests = user.interests || []; 

    // 2️⃣ Get articles the user has already interacted with
    const interactions = await InteractionModel.find({ user: userId });
    const seenArticleIds = interactions.map(i => i.article.toString());

    // 3️⃣ Recommended based on user interests (unseen)
    const interestArticles = await ArticleModel.find({
      tags: { $in: userInterests },
      _id: { $nin: seenArticleIds }
    }).limit(limit);

    // 4️⃣ If not enough, recommend popular articles the user hasn't seen
    let recommendations = interestArticles;
    if (recommendations.length < limit) {
      const remaining = limit - recommendations.length;

      // Count interactions per article
      const popularArticles = await InteractionModel.aggregate([
        { $match: { article: { $nin: seenArticleIds.map(id => new mongoose.Types.ObjectId(id)) } } },
        { $group: { _id: "$article", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: remaining }
      ]);

      const popularArticleIds = popularArticles.map(p => p._id);
      const popularArticlesDocs = await ArticleModel.find({ _id: { $in: popularArticleIds } });

      recommendations = recommendations.concat(popularArticlesDocs);
    }

    // 5️⃣ Map to DTO
    return recommendations.map(a => ({
      id: a._id.toString(),
      title: a.title,
      content: a.content,
      tags: a.tags,
      author: a.author.toString(),
      views: a.views ?? 0,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));
  }
}

export default ArticleService;
