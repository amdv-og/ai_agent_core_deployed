
import { Service, Inject } from "typedi";
import { Readable } from "stream";

import { TOKENS } from "../../core/tokens";
import * as Interfaces from "../../core/interfaces/imports";
import * as Entities from "../../core/entities/imports";
import * as Services from "../../infrastructure/services/imports";

/** Helper class for use cases.
 * Contains common methods used across different use cases.
 */
@Service()
export class UseCaseHelper {
    constructor(
        @Inject(TOKENS.IBlobService) private readonly blobService: Interfaces.IBlobService,
        @Inject(TOKENS.ISessionClient) private readonly sessionClient: Interfaces.ISessionClient,
        @Inject(TOKENS.IIndexClient) private readonly indexClient: Interfaces.IIndexClient,
        //@Inject(TOKENS.IAISvcClient) private readonly aiSvcClient: Interfaces.IAISvcClient,
        @Inject(TOKENS.ITrackingService) private readonly trackingService: Interfaces.ITrackingService,
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
        callback: string
    ): Promise<string> {
        let session: string;
        let token: Entities.SessionToken;
        let currentContext = context;

        currentContext.step = Entities.Step.SESSION;
        try {
            session = await this.sessionClient.createSession(context, documentType);
            token = await this.sessionClient.getSession(context, session);
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
            await this.indexClient.indexDocument(context, session, document, choice, callback);
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
