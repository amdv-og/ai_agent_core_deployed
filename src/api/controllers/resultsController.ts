import {
  JsonController,
  Get,
  Param,
  Res
} from "routing-controllers";
import { Response } from "express";
import { Inject, Service } from "typedi";
import { ResultsStore } from "../../infrastructure/services/resultsStore";

/**
 * Controller for retrieving callback results
 */
@Service()
@JsonController("/api")
export class ResultsController {
  constructor(
    @Inject() private readonly resultsStore: ResultsStore,
  ) { }

  /**
   * Get results for a specific session
   *
   * @route GET /api/session/:session
   */
  @Get("/session/:session")
  async getSession(
    @Param("session") session: string,
    @Res() res: Response
  ) {
    const results = this.resultsStore.get(session);

    if (!results) {
      return res.status(404).json({
        error: "Session not found",
        session,
        message: "No results received yet for this session. Results may still be processing, or the callback URL may not be publicly accessible."
      });
    }

    return res.json(results);
  }

  /**
   * Get all callbacks received
   *
   * @route GET /api/callbacks
   */
  @Get("/callbacks")
  async getAllCallbacks(@Res() res: Response) {
    const all = this.resultsStore.getAll();

    return res.json({
      total: all.length,
      callbacks: all
    });
  }
}
