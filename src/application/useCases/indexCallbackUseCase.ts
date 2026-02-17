import { Inject, Service } from "typedi";
import { Readable } from "stream";

import { TOKENS } from "../../core/tokens";
import * as Interfaces from "../../core/interfaces/imports";
import * as Entities from "../../core/entities/imports";
import * as Services from "../../infrastructure/services/imports";

/** Data structure for index callback use case.
 * Contains session identifier and callback data.
 * This interface is used to pass data to the use case for processing the index callback.
 * @interface IndexCallbackData
 * @property {string} session - The session identifier for the index process.
 * @property {Entities.CallbackData} callbackData - The data associated with the callback, containing necessary information for processing.
 */
export interface IndexCallbackData {
  session: string,
  callbackData: Entities.CallbackData
}

/** Use case for handling index callback.
 * It processes the document and triggers the next step in the workflow.
 */
@Service()
export class IndexCallbackUseCase {
  private readonly context: Entities.WorkflowContext = {
    workflow: Entities.Workflow.INDEX,
    step: Entities.Step.INDEX
  };

  constructor(
    @Inject(TOKENS.IIntegrationService) private readonly integrationService: Interfaces.IIntegrationService,
    @Inject(TOKENS.ITrackingService) private readonly trackingService: Interfaces.ITrackingService,
    @Inject(TOKENS.IBlobService) private readonly blobService: Interfaces.IBlobService,
    @Inject() private readonly metaDataService: Services.MetaDataService,
  ) { }

  /**
   * Executes the use case for processing the index callback.
   * 
   * @param data - The data containing session identifier and callback data
   */
  async execute(data: IndexCallbackData): Promise<void> {

    if (data.callbackData.status !== Entities.CallbackStatus.COMPLETED) {
      await this.trackingService.trackError(this.context, data.session, `Callback status is not success: ${data.callbackData.data}`);
      return;
    }

    let stream: Readable;
    let metaData: Entities.MetaData;

    try {
      stream = await this.blobService.download(data.callbackData.data);
      metaData = await this.metaDataService.parseStream(stream);
    }
    catch (error) {
      await this.trackingService.trackError(this.context, data.session, `Error reading metadata from blob: ${data.callbackData.data}`);
      return;
    }
    await this.trackingService.trackSuccess(this.context, data.session);

    // The processing should be done in the integration service 
    try {
      await this.integrationService.processIndex(data.session, metaData);
    }
    catch (error) {
      return;
    }
  }
}