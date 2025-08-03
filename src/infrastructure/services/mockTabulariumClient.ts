import { Service, Inject } from "typedi";
import { v4 as uuidv4 } from "uuid";

import { IAISvcClient } from "../../core/interfaces/aiSvcClient";
import * as Services from "../../infrastructure/services/imports"
import * as Entities from "../../core/entities/imports";

const metaData: Entities.MetaData = {
    heading: {
        title: "Mock Document",
        class: "class",
        explanation: "explanation"
    },
    secrets: [],
    indexes: [],
};

@Service()
export class MockTabulariumClient implements IAISvcClient {

    constructor(
        @Inject() private readonly tokenService: Services.TokenService,
    ) {
    }
    async getSession(context: Entities.WorkflowContext, sessionId: string): Promise<Entities.SessionToken> {
        const token: Entities.SessionToken = {
            baseUrl: "",
            token: ""
        };
        return token;
    }

    async createSession(context: Entities.WorkflowContext, documentType: string): Promise<string> {
        return uuidv4().toString();
    }

    async indexDocument(context: Entities.WorkflowContext, session: string, document: string, choice: Entities.ChoiceItem[], callback: Entities.Callback): Promise<void> {
        const data = `sn=${session}`;
        const token = this.tokenService.sign(data);
        const url = `${process.env.CALLBACK_URL}/${callback}?${data}`;
        const result: Entities.CallbackData = {
            status: Entities.CallbackStatus.SUCCESS,
            data: "https://example.com/test.json"

        }
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify(result)
        });
    }

    async feedbackDocument(context: Entities.WorkflowContext, session: string, segment: string, message: string): Promise<Entities.Feedback> {
        
        const feedback:Entities.Feedback = {
            segment: segment,
            message: message,
            accepted: true,
            data: "The feedback has been processed successfully.",
        };
        return feedback;
    }

    async refineDocument(context: Entities.WorkflowContext, session: string, segment: string, message: string, callback: Entities.Callback): Promise<void> {
        const data = `sn=${session}`;
        const token = this.tokenService.sign(data);
        const url = `${process.env.CALLBACK_URL}/${callback}?${data}`;
        const result: Entities.CallbackData = {
            status: Entities.CallbackStatus.SUCCESS,
            data: "https://example.com/test.json"

        }
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify(result)
        });
    }

    async calcDocument(context: Entities.WorkflowContext, session: string, metaData: Entities.MetaData | null, callback: Entities.Callback): Promise<void> {
        const data = `sn=${session}`;
        const token = this.tokenService.sign(data);
        const url = `${process.env.CALLBACK_URL}/${callback}?${data}`;
        const result: Entities.CallbackData = {
            status: Entities.CallbackStatus.SUCCESS,
            data: "https://example.com/test.json"

        }
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify(result)
        });
    }

    async redactDocument(context: Entities.WorkflowContext, session: string, metaData: Entities.MetaData | null, callback: Entities.Callback): Promise<void> {
        const data = `sn=${session}`;
        const token = this.tokenService.sign(data);
        const url = `${process.env.CALLBACK_URL}/${callback}?${data}`;
        const result: Entities.CallbackData = {
            status: Entities.CallbackStatus.SUCCESS,
            data: "https://example.com/test.json"

        }
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify(result)
        });
    }

    async recordDocument(session: string, callback: Entities.Callback): Promise<void> {
        const data = `sn=${session}`;
        const token = this.tokenService.sign(data);
        const url = `${process.env.CALLBACK_URL}/${callback}?${data}`;
        const result: Entities.CallbackData = {
            status: Entities.CallbackStatus.SUCCESS,
            data: "https://example.com/test.json"

        }
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify(result)
        });
    }


    async endorseDocument(context:Entities.WorkflowContext, session: string, metaData: Entities.MetaData, callback: Entities.Callback): Promise<void> {
        const data = `sn=${session}`;
        const token = this.tokenService.sign(data);
        const url = `${process.env.CALLBACK_URL}/${callback}?${data}`;
        const result: Entities.CallbackData = {
            status: Entities.CallbackStatus.SUCCESS,
            data: "https://example.com/test.json"

        }
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify(result)
        });
    }



}