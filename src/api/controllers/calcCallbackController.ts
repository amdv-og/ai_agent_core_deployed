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
import { CalcCallbackUseCase, CalcCallbackData } from "../../application/useCases/calcCallbackUseCase";

/**
 * Controller responsible for handling calc callbacks.
 * It processes various callback types related to calculation operations.
 */
@Service()
@JsonController("/callback")
export class CalcCallbackController {
    constructor(
        @Inject() private readonly helper: ControllerHelper,
        @Inject() private readonly useCase: CalcCallbackUseCase,
    ) { }

    /**
     * Handles calc callback.
     *
     * @route POST /callback/calc
     * @param session - The session identifier from the query parameters
     * @param token - The authorization token from the header
     * @param body - The callback data in the request body
     *
     * @returns 200 OK
     * @returns 401 Unauthorized - Invalid token
     * @returns 400 Bad Request - Invalid callback data
     */
    @Post(`/${Callback.CALC}`)
    async index(
        @Req() req: Request, @Res() res: Response,
        @QueryParam("sn") session: string,
        @HeaderParam("Authorization") token: string,
        @Body() callbackData: CallbackData
    ) {
        const tokenData = `${Callback.CALC}?sn=${session}`;
        return await this.helper.withCallbackErrorHandling(tokenData, token, callbackData, async () => {
            // Execute the use case
            const data: CalcCallbackData = {
                session: session,
                callbackData: callbackData
            };
            await this.useCase.execute(data);
        }, res);
    }
}