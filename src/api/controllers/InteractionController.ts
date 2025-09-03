import { Body, Controller, Delete, Get, Path, Post, Route, Tags, SuccessResponse } from "tsoa";
import { Inject, Service } from "typedi";
import InteractionService from "../services/InteractionService";
import { CreateInteractionDTO, InteractionResponseDTO } from "../dtos/InteractionDTO";
//import { successResponse } from "../helpers/responseHandlers";

@Route("interactions")
@Tags("Interactions")
@Service()
export class InteractionController extends Controller {
  constructor(@Inject() private interactionService: InteractionService) {
    super();
  }

  /**
   * Create a new interaction on an article
   */
  @Post("/")
  @SuccessResponse("200", "Interaction Created")
  public async createInteraction(
    @Body() body: CreateInteractionDTO
  ): Promise<InteractionResponseDTO> {
    this.setStatus(200)
    return this.interactionService.createInteraction(body);
  }

  /**
   * Get all interactions for a specific article
   */
  @Get("/{articleId}")
  public async getInteractionsByArticle(
    @Path() articleId: string
  ): Promise<InteractionResponseDTO[]> {
    return this.interactionService.getInteractionsByArticle(articleId);
  }

  /**
   * Delete a specific interaction
   */
  @Delete("/{id}")
  public async deleteInteraction(@Path() id: string): Promise<{ message: string }> {
    await this.interactionService.deleteInteraction(id);
    return { message: "Interaction deleted successfully" };
  }
}
