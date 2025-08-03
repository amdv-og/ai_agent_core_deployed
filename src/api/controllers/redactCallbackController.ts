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
import { RedactCallbackUseCase, RedactCallbackData } from "../../application/useCases/redactCallbackUseCase";

/**
 * Controller responsible for handling redact callbacks.
 * It processes various callback types related to redacting operations.
 */
@Service()
@JsonController("/callback")
export class RedactCallbackController {
    constructor(
        @Inject() private readonly helper: ControllerHelper,
        @Inject() private readonly useCase: RedactCallbackUseCase,
    ) { }

    /**
     * Handles redact callback.
     *
     * @route POST /callback/redact
     * @param session - The session identifier from the query parameters
     * @param token - The authorization token from the header
     * @param body - The callback data in the request body
     *
     * @returns 200 OK
     * @returns 401 Unauthorized - Invalid token
     * @returns 400 Bad Request - Invalid callback data
     */
    @Post(`/${Callback.REDACT}`)
    async index(
        @Req() req: Request, @Res() res: Response,
        @QueryParam("sn") session: string,
        @HeaderParam("Authorization") token: string,
        @Body() callbackData: CallbackData
    ) {
        const tokenData = `${Callback.REDACT}?sn=${session}`;
        return await this.helper.withCallbackErrorHandling(tokenData, token, callbackData, async () => {
            // Execute the use case
            const data: RedactCallbackData = {
                session: session,
                callbackData: callbackData
            };
            await this.useCase.execute(data);
        }, res);
    }
}