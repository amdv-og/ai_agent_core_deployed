import { Inject, Service } from "typedi";
import { Readable } from "stream";

import * as Services from "../../infrastructure/services/imports"
import * as Entities from "../../core/entities/imports";

/** Data structure for endorse callback use case.
 * Contains session identifier and callback data. 
 * This interface is used to pass data to the use case for processing the endorse callback.
 * @interface EndorseCallbackData
 * @property {string} session - The session identifier for the endorse process.
 * @property {Entities.CallbackData} callbackData - The data associated with the callback, containing necessary information for processing.
 */
export interface EndorseCallbackData {
  session: string,
  callbackData: Entities.CallbackData
}

/** Use case for handling endorse callback.
 * It processes the document and triggers the next step in the workflow.
 */
@Service()
export class EndorseCallbackUseCase {
  private readonly context: Entities.WorkflowContext = {
    workflow: Entities.Workflow.ENDORSE,
    step: Entities.Step.ENDORSE
  };

  constructor(
    @Inject(Services.TOKENS.IIntegrationService) private readonly integrationService: Services.IIntegrationService,
    @Inject(Services.TOKENS.ITrackingService) private readonly trackingService: Services.ITrackingService,
    @Inject(Services.TOKENS.IBlobService) private readonly blobService: Services.IBlobService,

  ) { }

  /**
   * Executes the use case for processing the endorse callback.
   * 
   * @param data - The data containing session identifier and callback data
   */
  async execute(data: EndorseCallbackData): Promise<void> {

    if (data.callbackData.status !== Entities.CallbackStatus.SUCCESS) {
      await this.trackingService.trackError(this.context, data.session, `Callback status is not success: ${data.callbackData.data}`);
      return;
    }

    let stream: Readable;

    try {
      stream = await this.blobService.download(data.callbackData.data);
    }
    catch (error) {
      await this.trackingService.trackError(this.context, data.session, `Error downloading blob: ${data.callbackData.data}`);
      return;
    }
    await this.trackingService.trackSuccess(this.context, data.session);

    // The processing should be done in the integration service 
    try {
      await this.integrationService.processEndorse(data.session, stream);
    }
    catch (error) {
      return;
    }
  }
}