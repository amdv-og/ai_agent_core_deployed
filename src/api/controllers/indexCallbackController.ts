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
import { IndexCallbackUseCase, IndexCallbackData } from "../../application/useCases/indexCallbackUseCase";

/**
 * Controller responsible for handling index callbacks.
 * It processes various callback types related to indexing operations.
 */
@Service()
@JsonController("/callback")
export class IndexCallbackController {
    constructor(
        @Inject() private readonly helper: ControllerHelper,
        @Inject() private readonly useCase: IndexCallbackUseCase,
    ) { }
    /**
     * Handles index callback.
     *
     * @route POST /callback/index
     * @param session - The session identifier from the query parameters
     * @param token - The authorization token from the header
     * @param body - The callback data in the request body
     *
     * @returns 200 OK
     * @returns 401 Unauthorized - Invalid token
     * @returns 400 Bad Request - Invalid callback data
     */
    @Post(`/${Callback.INDEX}`)
    async index(
        @Req() req: Request, @Res() res: Response,
        @QueryParam("sn") session: string,
        @HeaderParam("Authorization") token: string,
        @Body() callbackData: CallbackData
    ) {
        const tokenData = `${Callback.INDEX}?sn=${session}`;
        return await this.helper.withCallbackErrorHandling(tokenData, token, callbackData, async () => {
            // Execute the use case
            const data: IndexCallbackData = {
                session: session,
                callbackData: callbackData
            };
            await this.useCase.execute(data);
        }, res);
    }
}