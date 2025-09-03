import { Service } from "typedi";
import InteractionModel from "../models/Interaction";
import { AppError } from "../errors/AppError";
import { CreateInteractionDTO, InteractionResponseDTO } from "../dtos/InteractionDTO";

@Service()
export default class InteractionService {
  public async createInteraction(dto: CreateInteractionDTO): Promise<InteractionResponseDTO> {
    const interaction = new InteractionModel({
      article: dto.articleId,
      user: dto.userId,
      type: dto.type,
      comment: dto.commentText,
    });

    const saved = await interaction.save();

    return {
      id: saved._id.toString(),
      articleId: saved.article.toString(),
      userId: saved.user.toString(),
      type: saved.type,
      comment: saved.commentText,
      createdAt: saved.createdAt.toISOString(),
      updatedAt: saved.updatedAt.toISOString(),
    };
  }

  public async getInteractionsByArticle(articleId: string): Promise<InteractionResponseDTO[]> {
    const interactions = await InteractionModel.find({ article: articleId });

    return interactions.map((i) => ({
      id: i._id.toString(),
      articleId: i.article.toString(),
      userId: i.user.toString(),
      type: i.type,
      comment: i.commentText,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
    }));
  }

  public async deleteInteraction(id: string): Promise<void> {
    const interaction = await InteractionModel.findById(id);
    if (!interaction) throw new AppError("Interaction not found", 404);

    await interaction.deleteOne();
  }
}
