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
import { EndorseCallbackUseCase, EndorseCallbackData } from "../../application/useCases/endorseCallbackUseCase";

/**
 * Controller responsible for handling endorse callbacks.
 * It processes various callback types related to endorsing operations.
 */
@Service()
@JsonController("/callback")
export class EndorseCallbackController {
    constructor(
        @Inject() private readonly helper: ControllerHelper,
        @Inject() private readonly useCase: EndorseCallbackUseCase,
    ) { }

    /**
     * Handles endorse callback.
     *
     * @route POST /callback/endorse
     * @param session - The session identifier from the query parameters
     * @param token - The authorization token from the header
     * @param body - The callback data in the request body
     *
     * @returns 200 OK
     * @returns 401 Unauthorized - Invalid token
     * @returns 400 Bad Request - Invalid callback data
     */
    @Post(`/${Callback.ENDORSE}`)
    async index(
        @Req() req: Request, @Res() res: Response,
        @QueryParam("sn") session: string,
        @HeaderParam("Authorization") token: string,
        @Body() callbackData: CallbackData
    ) {
        const tokenData = `${Callback.ENDORSE}?sn=${session}`;
        return await this.helper.withCallbackErrorHandling(tokenData, token, callbackData, async () => {
            // Execute the use case
            const data: EndorseCallbackData = {
                session: session,
                callbackData: callbackData
            };
            await this.useCase.execute(data);
        }, res);
    }
}