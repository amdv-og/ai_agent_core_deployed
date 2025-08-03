
import { Service, Inject } from "typedi";
import { Readable } from "stream";

import * as Services from "../../infrastructure/services/imports";
import * as Entities from "../../core/entities/imports";

/** Helper class for use cases.
 * Contains common methods used across different use cases.
 */
@Service()
export class UseCaseHelper {
    constructor(
        @Inject(Services.TOKENS.IBlobService) private readonly blobService: Services.IBlobService,
        @Inject(Services.TOKENS.IAISvcClient) private readonly aiSvcClient: Services.IAISvcClient,
        @Inject(Services.TOKENS.ITrackingService) private readonly trackingService: Services.ITrackingService,
        @Inject() private readonly metaDataService: Services.MetaDataService
    ) { }


    /**
     * Indexes a document and returns the session identifier.
     * 
     * @param context - The workflow context
     * @param documentType - The type of the document being indexed
     * @param stream - The stream of the document content
     * @param choice - The choices associated with the document
     * @param callback - The callback type for the operation
     * @returns {Promise<string>} - Returns the session identifier for the indexed document
     */
    async index(
        context: Entities.WorkflowContext,
        documentType: string,
        stream: Readable,
        choice: Entities.ChoiceItem[],
        callback: Entities.Callback
    ): Promise<string> {
        let session: string;
        let token: Entities.SessionToken;
        let currentContext = context;

        currentContext.step = Entities.Step.SESSION;
        try {
            session = await this.aiSvcClient.createSession(context, documentType);
            token = await this.aiSvcClient.getSession(context, session);
            await this.trackingService.trackSuccess(currentContext, session);
        }
        catch (error) {
            const message = "Failed to create session";
            await this.trackingService.trackError(currentContext, "", message);
            throw new Entities.InternalError(message);
        }

        currentContext.step = Entities.Step.UPLOAD;
        const document = `${session}.${documentType}`;
        const url = `${token.baseUrl}/${document}?${token.token}`;
        try {
            await this.blobService.upload(url, stream);
            await this.trackingService.trackSuccess(currentContext, session);
        } catch (error) {
            const message = "Failed to upload document";
            await this.trackingService.trackError(currentContext, session, message);
            throw new Entities.InternalError(message);
        }

        currentContext.step = Entities.Step.INDEX;
        try {
            await this.aiSvcClient.indexDocument(context, session, document, choice, callback);
        }
        catch (error) {
            const message = "Failed to index document";
            await this.trackingService.trackError(context, session, message);
            throw new Entities.InternalError(message);
        }

        return session;
    }

    /**
     * Loads metadata from a blob and returns it.
     * 
     * @param context - The workflow context
     * @param url - The URL of the blob containing the metadata
     * @param session - The session identifier for tracking
     * @returns {Promise<Entities.MetaData>} - Returns the parsed metadata
     */
    async loadMetadata(
        context: Entities.WorkflowContext,
        url: string,
        session: string): Promise<Entities.MetaData> {

        let stream: Readable;
        let metaData: Entities.MetaData;

        try {
            stream = await this.blobService.download(url);
            metaData = await this.metaDataService.parseStream(stream);
            return metaData;
        }
        catch (error) {
            const message = `Error reading metadata from blob: ${url}`;
            await this.trackingService.trackError(context, session, `Error reading metadata from blob: ${url}`);
            throw new Entities.NotFoundError(message);
        }
    }


}
