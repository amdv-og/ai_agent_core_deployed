import { Inject, Service } from "typedi";
import { Readable } from "stream";

import * as Services from "../../infrastructure/services/imports"
import * as Entities from "../../core/entities/imports";

/**
 * Data structure for auto-redact callback redact use case.
 * Contains session identifier and callback data.
 * @interface AutoRedactCallbackRedactData
 * @property {string} session - The session identifier for the callback.
 * @property {Entities.CallbackData} callbackData - The data associated with the callback.
 * This interface is used to pass data to the use case for processing auto-redact callbacks.
 */
export interface AutoRedactCallbackRedactData {
  session: string,
  callbackData: Entities.CallbackData
}

/**
 * Use case for handling auto-redact callbacks.
 * It processes the callback data and triggers the next step in the workflow.
 */
@Service()
export class AutoRedactCallbackRedactUseCase {
  private readonly context: Entities.WorkflowContext = {
    workflow: Entities.Workflow.AUTOREDACT,
    step: Entities.Step.REDACT
  };

  constructor(
    @Inject(Services.TOKENS.IIntegrationService) private readonly integrationService: Services.IIntegrationService,
    @Inject(Services.TOKENS.ITrackingService) private readonly trackingService: Services.ITrackingService,
    @Inject(Services.TOKENS.IBlobService) private readonly blobService: Services.IBlobService,
  ) { }

  /**
   * Executes the use case for processing the auto-redact callback.
   * 
   * @param data - The data containing session and callback information
   */
  async execute(data: AutoRedactCallbackRedactData): Promise<void> {

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
      await this.integrationService.processAutoRedact(data.session, stream);
    }
    catch (error) {
      return;
    }
  }
}