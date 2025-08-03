import { Service, Inject } from "typedi";


import * as Entities from "../../core/entities/imports";
import { ITrackingService } from "./imports";
import { IAISvcClient } from "./imports";
import { TOKENS } from "./imports";
import { TokenService } from "./tokenService";



/** Tabularium client service.
 * Implements the IAISvcClient interface to interact with the Tabularium API.
 * This service provides methods for managing sessions, indexing documents, and handling feedback.
 */
@Service()
export class TabulariumClient implements IAISvcClient {

    constructor(
        @Inject() private readonly tokenService: TokenService,
        //@Inject(TOKENS.ITrackingService) private readonly trackingService: ITrackingService,
    ) {}

    async getSession(context: Entities.WorkflowContext, session: string): Promise<Entities.SessionToken> {
        const url = `${process.env.TABULARIUM_URL}/session/${session}/data`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.TABULARIUM_API_KEY}`,
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
        const url = `${process.env.TABULARIUM_URL}/session/new`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.TABULARIUM_API_KEY}`,
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

    async indexDocument(context: Entities.WorkflowContext, session: string, document: string, choices: Entities.ChoiceItem[], callback: Entities.Callback): Promise<void> {
        const url = `${process.env.TABULARIUM_URL}/document/${session}/index`;

        const callbackData = `${callback}?sn=${session}`;
        const callbackToken = this.tokenService.sign(callbackData);
        const callbackUrl = `${callbackData}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.TABULARIUM_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "doc_name": document,
                "choices": choices,
                "callback_url": `${process.env.CALLBACK_URL}/${callbackUrl}`,
                "callback_token": callbackToken,
            }),
        });

        if (!response.ok) {
            throw new Entities.InternalError(`Failed to index document: ${response.statusText}`);
        }
    }

    async feedbackDocument(context: Entities.WorkflowContext, session: string, segment: string, message: string): Promise<Entities.Feedback> {
        const url = `${process.env.TABULARIUM_URL}/feedback/${session}/submit/${segment}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.TABULARIUM_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "message": message,
            }),
        });

        if (!response.ok) {
            throw new Entities.InternalError(`Failed to feedback document: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data) {
            throw new Entities.InternalError("Failed to feedback document");
        }
        if (data.accepted === "true") {
            return {
                segment: segment,
                message: message,
                accepted: true,
                data: data.data || null
            };
        } else {
            return {
                segment: segment,
                message: message,
                accepted: false,
                data: data.data || null
            };

        }
    }

    async refineDocument(context: Entities.WorkflowContext, session: string, segment: string, message: string, callback: Entities.Callback): Promise<void> {
        const url = `${process.env.TABULARIUM_URL}/reprocess/${session}/class/${segment}`;

        const callbackData = `${callback}?sn=${session}`;
        const callbackToken = this.tokenService.sign(callbackData);
        const callbackUrl = `${callbackData}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.TABULARIUM_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "callback_url": `${process.env.CALLBACK_URL}/${callbackUrl}`,
                "callback_token": callbackToken,
            }),
        });

        if (!response.ok) {
            throw new Entities.InternalError(`Failed to refine document: ${response.statusText}`);
        }
    }

    async calcDocument(context: Entities.WorkflowContext, session: string, metaData: Entities.MetaData | null, callback: Entities.Callback): Promise<void> {
        const url = `${process.env.TABULARIUM_URL}/compute/${session}/calculate`;

        const callbackData = `${callback}?sn=${session}`;
        const callbackToken = this.tokenService.sign(callbackData);
        const callbackUrl = `${callbackData}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.TABULARIUM_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "data": metaData ? metaData : null,
                "callback_url": `${process.env.CALLBACK_URL}/${callbackUrl}`,
                "callback_token": callbackToken,
            }),

        });

        if (!response.ok) {
            throw new Entities.InternalError(`Failed to calculat document: ${response.statusText}`);
        }

    }

    async redactDocument(context: Entities.WorkflowContext, session: string, metaData: Entities.MetaData | null, callback: Entities.Callback): Promise<void> {
        const url = `${process.env.TABULARIUM_URL}/redact/${session}/mask`;

        const callbackData = `${callback}?sn=${session}`;
        const callbackToken = this.tokenService.sign(callbackData);
        const callbackUrl = `${callbackData}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.TABULARIUM_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "data": metaData ? metaData : null,
                "callback_url": `${process.env.CALLBACK_URL}/${callbackUrl}`,
                "callback_token": callbackToken,
            }),
        });

        if (!response.ok) {
            throw new Entities.InternalError(`Failed to redact document: ${response.statusText}`);
        }
    }


    async endorseDocument(context: Entities.WorkflowContext, session: string, metaData: Entities.MetaData, callback: Entities.Callback): Promise<void> {
        const url = `${process.env.TABULARIUM_URL}/record/${session}/endorsement`;

        const callbackData = `${callback}?sn=${session}`;
        const callbackToken = this.tokenService.sign(callbackData);
        const callbackUrl = `${callbackData}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.TABULARIUM_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "data": metaData,
                "callback_url": `${process.env.CALLBACK_URL}/${callbackUrl}`,
                "callback_token": callbackToken,
            }),
        });

        if (!response.ok) {
            throw new Entities.InternalError(`Failed to endorse document: ${response.statusText}`);
        }
    }

}