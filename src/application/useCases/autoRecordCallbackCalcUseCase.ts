
import { Inject, Service } from "typedi";

import { TOKENS } from "../../core/tokens";
import * as Interfaces from "../../core/interfaces/imports";
import * as Entities from "../../core/entities/imports";
import { UseCaseHelper } from "../utils/useCaseHelper";

/** * Data structure for auto-record calculation callback use case.
 * Contains session identifier and callback data.
 * @interface AutoRecordCallbackCalcData
 * @property {string} session - The session identifier for the callback.
 * @property {Entities.CallbackData} callbackData - The data associated with the callback.
 * * This interface is used to pass data to the use case for processing auto-record calculation callbacks.
 */
export interface AutoRecordCallbackCalcData {
  session: string,
  callbackData: Entities.CallbackData
}

/**
 * Use case for handling auto-record calculation callbacks.
 * It processes the callback data and triggers the next step in the workflow.
 */
@Service()
export class AutoRecordCallbackCalcUseCase {
  private readonly context: Entities.WorkflowContext = {
    workflow: Entities.Workflow.AUTORECORD,
    step: Entities.Step.CALC
  };
  private readonly nextContext: Entities.WorkflowContext = {
    workflow: Entities.Workflow.AUTORECORD,
    step: Entities.Step.ENDORSE
  };

  constructor(
    @Inject(TOKENS.IRecordClient) private readonly recordClient: Interfaces.IRecordClient,
    @Inject(TOKENS.IIntegrationService) private readonly integrationService: Interfaces.IIntegrationService,
    @Inject(TOKENS.ITrackingService) private readonly trackingService: Interfaces.ITrackingService,
    @Inject() private readonly helper: UseCaseHelper,
  ) { }

  /**
   * Executes the use case for processing the auto-record calculation callback.
   * 
   * @param data - The data containing session and callback information
   */
  async execute(data: AutoRecordCallbackCalcData): Promise<void> {

    let metaData = await this.helper.loadMetadata(this.context, data.callbackData.data, data.session);
    await this.trackingService.trackSuccess(this.context, data.session);
    metaData = await this.integrationService.record(data.session, metaData);

    try {
      await this.recordClient.endorseDocument(this.context, data.session, metaData, Entities.Callback.AUTORECORD_ENDORSE);
    }
    catch (error) {
      await this.trackingService.trackError(this.nextContext, data.session, error instanceof Error ? error.message : String(error));
      return;
    }
  }
}