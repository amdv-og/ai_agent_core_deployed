import {
    JsonController,
    Post,
    Req,
    Res,
    QueryParam,
    Body,
    HeaderParam
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { Request, Response } from "express";

import { Callback, CallbackData } from "../../core/entities/callback";
import { ControllerHelper } from "../utils/controllerHelper";
import { AutoRedactCallbackIndexUseCase, AutoRedactCallbackIndexData } from "../../application/useCases/autoRedactCallbackIndexUseCase";
import { AutoRedactCallbackRedactUseCase, AutoRedactCallbackRedactData } from "../../application/useCases/autoRedactCallbackRedactUseCase";
import { ResultsStore } from "../../infrastructure/services/resultsStore";

/**
 * Controller responsible for handling auto-redact callbacks.
 * It processes various callback types related to auto-redaction operations.
 */
@Service()
@JsonController("/callback")
export class AutoRedactCallbackController {
    constructor(
        @Inject() private readonly helper: ControllerHelper,
        @Inject() private readonly autoRedactCallbackRedactUseCase: AutoRedactCallbackRedactUseCase,
        @Inject() private readonly autoRedactCallbackIndexUseCase: AutoRedactCallbackIndexUseCase,
        @Inject() private readonly resultsStore: ResultsStore,
    ) { }

    /**
     * Handles auto-redact index callback.
     *
     * @route POST /callback/autoredact/index
     * @param session - The session identifier from the query parameters
     * @param token - The authorization token from the header
     * @param body - The callback data in the request body
     *
     * @returns 200 OK
     * @returns 401 Unauthorized - Invalid token
     * @returns 400 Bad Request - Invalid callback data
     */
    @Post(`/${Callback.AUTOREDACT_INDEX}`)
    async autoRedacIndex(
        @Req() req: Request, @Res() res: Response,
        @QueryParam("sn") session: string,
        @HeaderParam("Authorization") token: string,
        @Body() callbackData: CallbackData
    ) {
        const tokenData = `${Callback.AUTOREDACT_INDEX}?sn=${session}`;
        return await this.helper.withCallbackErrorHandling(tokenData, token, callbackData, async () => {
            // Store results
            this.resultsStore.store(session, 'autoredact-index', callbackData);

            // Execute the use case
            const indexData: AutoRedactCallbackIndexData = { session: session, callbackData: callbackData };
            await this.autoRedactCallbackIndexUseCase.execute(indexData);
        }, res);
    }

    /**
     * Handles auto-redact redact callback.
     *
     * @route POST /callback/autoredact/redact
     * @param session - The session identifier from the query parameters
     * @param token - The authorization token from the header
     * @param body - The callback data in the request body
     *
     * @returns 200 OK
     * @returns 401 Unauthorized - Invalid token
     * @returns 400 Bad Request - Invalid callback data
     */
    @Post(`/${Callback.AUTOREDACT_REDACT}`)
    async autoRedactRedact(
        @Req() req: Request, @Res() res: Response,
        @QueryParam("sn") session: string,
        @HeaderParam("Authorization") token: string,
        @Body() callbackData: CallbackData
    ) {
        const tokenData = `${Callback.AUTOREDACT_REDACT}?sn=${session}`;
        return await this.helper.withCallbackErrorHandling(tokenData, token, callbackData, async () => {
            // Store results
            this.resultsStore.store(session, 'autoredact-redact', callbackData);

            // Execute the use case
            const data: AutoRedactCallbackRedactData = { session: session, callbackData: callbackData };
            await this.autoRedactCallbackRedactUseCase.execute(data);
        }, res);
    }
}