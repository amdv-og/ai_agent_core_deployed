import { Inject, Service } from "typedi";

import * as Services from "../../infrastructure/services/imports"
import * as Entities from "../../core/entities/imports";


/** Data structure for refine use case.
 * Contains session identifier and segment information.
 * This interface is used to pass data to the use case for processing the refine operation.
 * @interface RefineData
 * @property {string} session - The session identifier for the refine process.
 * @property {string} segment - The segment of the document to be refined.
 * @property {string} message - The message associated with the refine operation.
 */
export interface RefineData {
  session: string,
  segment: string,
  message: string
}

/** Use case for handling refine operations.
 * It processes the document and triggers the next step in the workflow.
 */
@Service()
export class RefineUseCase {
  private readonly feedbackContext: Entities.WorkflowContext = {
    workflow: Entities.Workflow.REFINE,
    step: Entities.Step.FEEDBACK
  };
  private readonly context: Entities.WorkflowContext = {
    workflow: Entities.Workflow.REFINE,
    step: Entities.Step.FEEDBACK
  };

  constructor(
    @Inject(Services.TOKENS.IAISvcClient) private readonly aiSvcClient: Services.IAISvcClient
  ) { }

  /**
   * Executes the use case for processing the refine operation.
   * 
   * @param data - The data containing session identifier, segment, and message
   */
  async execute(data: RefineData): Promise<void> {

    const feedback = await this.aiSvcClient.feedbackDocument(this.feedbackContext, data.session, data.segment, data.message);
    await this.aiSvcClient.refineDocument(this.context, data.session, data.segment, data.message, Entities.Callback.REFINE);
  }
}
