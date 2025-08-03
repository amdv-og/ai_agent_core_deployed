import { Inject, Service } from "typedi";

import * as Services from "../../infrastructure/services/imports"
import * as Entities from "../../core/entities/imports";

/** Data structure for calc use case.
 * Contains session identifier and metadata.
 * This interface is used to pass data to the use case for processing the calc operation.
 * @interface CalcData
 * @property {string} session - The session identifier for the calc process.
 * @property {Entities.MetaData | null} metaData - The metadata associated with the calc operation, can be null if not available.
 */
export interface CalcData {
    session: string,
    metaData: Entities.MetaData | null
}

/** Use case for handling calc operations.
 * It processes the document and triggers the next step in the workflow.
 */
@Service()
export class CalcUseCase {

    constructor(
        @Inject(Services.TOKENS.IAISvcClient) private readonly aiSvcClient: Services.IAISvcClient
    ) { }

    /**
     * Executes the use case for processing the calc operation.
     * 
     * @param data - The data containing session identifier and metadata
     */
    async execute(data: CalcData): Promise<void> {
        const context: Entities.WorkflowContext = {
            workflow: Entities.Workflow.CALC,
            step: Entities.Step.CALC
        };

        await this.aiSvcClient.calcDocument(context, data.session, data.metaData, Entities.Callback.CALC);
    }

}