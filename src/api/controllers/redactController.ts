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
import { MetaDataService } from "../../infrastructure/services/metaDataService";
import { MetaData } from "../../core/entities/metadata";
import { RedactUseCase, RedactData } from "../../application/useCases/redactUseCase";

/**
 * Controller responsible for handling redact operations.
 * It processes a metadata for a specific session.
 */
@Service()
@JsonController()
export class RedactController {
    constructor(
        @Inject() private readonly helper: ControllerHelper,
        @Inject() private readonly useCase: RedactUseCase,
        @Inject() private readonly metaDataService: MetaDataService,
    ) { }

    /**
     * Starts redaction of sensitive information of a session's document based on the provided metadata.
     *
     * @route POST /redact/:session
     * @param session - Session identifier
     * @param metaData - The metadata payload containing information to redact
     *
     * @returns 200 OK - Success
     * @returns 400 Bad Request - Validation error
     * @returns 404 Not Found - From use case
     * @returns 500 Internal Server Error - From use case
     */

    @Post("/redact/:session")
    async redact(
        @Req() req: Request, @Res() res: Response,
        @Param("session") session: string,
        @Body() metaData: MetaData | null,
    ) {
        return await this.helper.withErrorHandling(async () => {
            // Validate metadata format
            if (!metaData || Object.keys(metaData).length === 0) {
                metaData = null; 
            }
            if (metaData && !this.metaDataService.validateMetaData(metaData)) {
                throw new BadRequestError("Invalid request: valid MetaData is required");
            }
            // Execute the use case
            const data: RedactData = {
                session: session,
                metaData: metaData
            }
            await this.useCase.execute(data);
            return {};
        }, res);
    }
}
