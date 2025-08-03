import { Inject, Service } from "typedi";

import * as Services from "../../infrastructure/services/imports"
import * as Entities from "../../core/entities/imports";

/** Data structure for provision callback index use case.
 * Contains session identifier and callback data.
 * This interface is used to pass data to the use case for processing the provision callback index.
 * @interface ProvisionCallbackIndexData
 * @property {string} session - The session identifier for the provision process.
 * @property {Entities.CallbackData} callbackData - The data associated with the callback, containing necessary information for processing.
 */
export interface ProvisionCallbackIndexData {
  session: string,
  callbackData: Entities.CallbackData
}

/** Use case for handling provision callback index.
 * It processes the document and triggers the next step in the workflow.
 */
@Service()
export class ProvisionCallbackIndexUseCase {
  private readonly context:Entities.WorkflowContext = {
    workflow: Entities.Workflow.PROVISION,
    step: Entities.Step.INDEX
  };
  private readonly nextContext:Entities.WorkflowContext = {
    workflow: Entities.Workflow.PROVISION,
    step: Entities.Step.CALC
  };

  constructor(
    @Inject(Services.TOKENS.IAISvcClient) private readonly aiSvcClient: Services.IAISvcClient,
    @Inject(Services.TOKENS.ITrackingService) private readonly trackingService: Services.ITrackingService,
  ) { }

  /**
   * Executes the use case for processing the provision callback index.
   * 
   * @param data - The data containing session identifier and callback information
   */
  async execute(data: ProvisionCallbackIndexData): Promise<void> {

    await this.trackingService.trackSuccess(this.context, data.session);

    try {
      await this.aiSvcClient.calcDocument(this.context, data.session, null, Entities.Callback.PROVISION_CALC);
    }
    catch (error) {
      await this.trackingService.trackError(this.nextContext, data.session,  error instanceof Error ? error.message : String(error));
      return;
    }
  }
}