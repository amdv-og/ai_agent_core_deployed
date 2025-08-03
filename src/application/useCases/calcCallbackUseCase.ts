import { Inject, Service } from "typedi";
import { Readable } from "stream";

import * as Services from "../../infrastructure/services/imports"
import * as Entities from "../../core/entities/imports";

/** Data structure for calc callback use case.
 * Contains session identifier and callback data. 
 * This interface is used to pass data to the use case for processing the calc callback.
 * @interface CalcCallbackData
 * @property {string} session - The session identifier for the calc process.
 * @property {Entities.CallbackData} callbackData - The data associated with the callback, containing necessary information for processing.
 */
export interface CalcCallbackData {
  session: string,
  callbackData: Entities.CallbackData
}

/** Use case for handling calc callback.
 * It processes the document and triggers the next step in the workflow.
 */
@Service()
export class CalcCallbackUseCase {
  private readonly context: Entities.WorkflowContext = {
    workflow: Entities.Workflow.CALC,
    step: Entities.Step.CALC
  };

  constructor(
    @Inject(Services.TOKENS.IIntegrationService) private readonly integrationService: Services.IIntegrationService,
    @Inject(Services.TOKENS.ITrackingService) private readonly trackingService: Services.ITrackingService,
    @Inject(Services.TOKENS.IBlobService) private readonly blobService: Services.IBlobService,
    @Inject() private readonly metaDataService: Services.MetaDataService,
  ) { }

  /**
   * Executes the use case for processing the calc callback.
   * 
   * @param data - The data containing session identifier and callback data
   */
  async execute(data: CalcCallbackData): Promise<void> {

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
      await this.integrationService.processCalc(data.session, metaData);
    }
    catch (error) {
      return;
    }
  }
}