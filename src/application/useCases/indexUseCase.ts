import { Inject, Service } from "typedi";
import { Readable } from "stream";

import * as Services from "../../infrastructure/services/imports"
import * as Entities from "../../core/entities/imports";
import { UseCaseHelper } from "../utils/useCaseHelper";

/** Data structure for index use case.
 * Contains document type, stream, and choice items.
 * This interface is used to pass data to the use case for processing the index operation.
 * @interface IndexData
 * @property {string} documentType - The type of the document being indexed.
 * @property {Readable} stream - The stream of the document content.
 * @property {Entities.ChoiceItem[]} choice - The choices associated with the document.
 */
export interface IndexData {
    documentType: string,
    stream: Readable,
    choice: Entities.ChoiceItem[]
}

/** Use case for handling index operations.
 * It processes the document and triggers the next step in the workflow.
 */
@Service()
export class IndexUseCase {
    private readonly context: Entities.WorkflowContext = {
        workflow: Entities.Workflow.INDEX,
        step: Entities.Step.INDEX
    };

    constructor(
        @Inject(Services.TOKENS.IBlobService) private readonly blobService: Services.IBlobService,
        @Inject(Services.TOKENS.IAISvcClient) private readonly aiSvcClient: Services.IAISvcClient,
        @Inject(Services.TOKENS.ITrackingService) private readonly trackingService: Services.ITrackingService,
        @Inject() private readonly helper: UseCaseHelper,
    ) { }

    /**
     * Executes the use case for processing the index operation.
     * 
     * @param data - The data containing document type, stream, and choice items
     * @returns {Promise<string>} - Returns the session identifier for the indexed document
     */
    async execute(data: IndexData): Promise<string> {
        const session = await this.helper.index(this.context, data.documentType, data.stream, data.choice, Entities.Callback.AUTORECORD_INDEX);
        return session;
    }
}