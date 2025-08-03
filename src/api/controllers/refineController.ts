import {
    JsonController,
    Post,
    Req,
    Res,
    Param,
    Body,
} from "routing-controllers";
import { Request, Response } from "express";
import { Inject, Service } from "typedi";

import { ControllerHelper } from "../utils/controllerHelper";
import { BadRequestError } from "../../core/entities/error"
import { SegmentService } from "../../infrastructure/services/segmentService";
import { Notice } from "../../core/entities/notice";
import { RefineUseCase, RefineData } from "../../application/useCases/refineUseCase";

/**
 * Controller responsible for handling refine operations.
 * It processes a text notice for a specific session and document segment.
 */

@Service()
@JsonController()
export class RefineController {
    constructor(
        @Inject() private readonly helper: ControllerHelper,
        @Inject() private readonly useCase: RefineUseCase,
        @Inject() private readonly segmentService: SegmentService,
    ) { }

    /**
     * Starts refinement of a segment of a session's document based on the provided notice.
     *
     * @route POST /refine/:session/:segment
     * @param session - Session identifier
     * @param segment - Document segment identifier
     * @param notice - The notice payload containing text to refine
     *
     * @returns 200 OK - Success
     * @returns 400 Bad Request - Validation error
     * @returns 404 Not Found - From use case
     * @returns 500 Internal Server Error - From use case
     */
    @Post("/refine/:session/:segment")
    async refine(
        @Req() req: Request, @Res() res: Response,
        @Param("session") session: string,
        @Param("segment") segment: string,
        @Body() notice: Notice,
    ) {
        return await this.helper.withErrorHandling(async () => {
            // Validate notice format
            if (!notice || !notice.message || !notice.message || notice.message.trim() === "") {
                throw new BadRequestError("Invalid request: valid Notice is required");
            }
            // Validate segment format
            if (!this.segmentService.validateSegment(segment)) {
                throw new BadRequestError("Invalid segment");
            }
            // Execute the use case
            const data: RefineData = {
                session: session,
                segment: segment,
                message: notice.message
            }
            await this.useCase.execute(data);
            return {};
        }, res);
    }
}
