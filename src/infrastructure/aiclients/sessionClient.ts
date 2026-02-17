import { Service, Inject } from "typedi";


import * as Entities from "../../core/entities/imports";
import { TokenService } from "../services/tokenService";
import { ISessionClient } from "../../core/interfaces/sessionClient";
import { Config } from "../../config";



/** Tabularium session client service.
 * Implements the ITabulariumSessionClient interface to interact with the Tabularium API.
 * This service provides methods for managing sessions.
 */
@Service()
export class SessionClient implements ISessionClient {

    constructor(
        @Inject() private readonly tokenService: TokenService,
        //@Inject(TOKENS.ITrackingService) private readonly trackingService: ITrackingService,
    ) {}

    async getSession(context: Entities.WorkflowContext, session: string): Promise<Entities.SessionToken> {
        const url = Config.session.get(session);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Config.apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Entities.NotFoundError(`Failed to get session: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data) {
            throw new Entities.NotFoundError(`Failed to get session: ${response.statusText}`);
        }
        const token:Entities.SessionToken = {
            baseUrl: data.base_url,
            token: data.sas_token
        };
        return token;
    }

    async createSession(context: Entities.WorkflowContext, documentType: string): Promise<string> {
        const url = Config.session.create();

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${Config.apiKey}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Entities.InternalError(`Failed to create session: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data) {
            throw new Entities.InternalError("Invalid session data received");
        }

        return data.session;
    }


}