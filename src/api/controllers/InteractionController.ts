import { Body, Controller, Delete, Get, Path, Post, Route, Tags } from "tsoa";
import { Inject } from "typedi";
import InteractionService from "../services/InteractionService";
import { CreateInteractionDTO, InteractionResponseDTO } from "../dtos/InteractionDTO";

@Route("interactions")
@Tags("Interactions")
export class InteractionController extends Controller {
  constructor(@Inject() private interactionService: InteractionService) {
    super();
  }

  @Post("/")
  public async createInteraction(
    @Body() body: CreateInteractionDTO
  ): Promise<InteractionResponseDTO> {
    return this.interactionService.createInteraction(body);
  }

  @Get("/{articleId}")
  public async getInteractions(
    @Path() articleId: string
  ): Promise<InteractionResponseDTO[]> {
    return this.interactionService.getInteractionsByArticle(articleId);
  }

  @Delete("/{id}")
  public async deleteInteraction(
    @Path() id: string
  ): Promise<{ message: string }> {
    await this.interactionService.deleteInteraction(id);
    return { message: "Interaction deleted successfully" };
  }
}
