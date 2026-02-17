import { Inject, Service } from "typedi";

import { TOKENS } from "../../core/tokens";
import * as Interfaces from "../../core/interfaces/imports";
import * as Entities from "../../core/entities/imports";


/** Data structure for reprocess use case.
 * Contains session identifier and segment information.
 * This interface is used to pass data to the use case for processing the reprocess operation.
 * @interface ReprocessData
 * @property {string} session - The session identifier for the reprocess process.
 * @property {string} segment - The segment of the document to be reprocessed.
 */
export interface ReprocessData {
  session: string,
  segment: string,
}

/** Use case for handling reprocess operations.
 * It processes the document and triggers the next step in the workflow.
 */
@Service()
export class ReprocessUseCase {
  private readonly context: Entities.WorkflowContext = {
    workflow: Entities.Workflow.REPROCESS,
    step: Entities.Step.REPROCESS
  };

  constructor(
    @Inject(TOKENS.IReprocessClient) private readonly reprocessClient: Interfaces.IReprocessClient
  ) { }

  /**
   * Executes the use case for processing the reprocess operation.
   * 
   * @param data - The data containing session identifier, segment, and message
   */
  async execute(data: ReprocessData): Promise<void> {

    //const feedback = await this.feedbackClient.feedbackDocument(this.feedbackContext, data.session, data.segment, data.message);
    await this.reprocessClient.reprocessDocument(this.context, data.session, data.segment, Entities.Callback.REPROCESS);
  }
}
