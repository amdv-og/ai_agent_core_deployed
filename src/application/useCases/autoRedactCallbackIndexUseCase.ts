import { Inject, Service } from "typedi";

import { TOKENS } from "../../core/tokens";
import * as Interfaces from "../../core/interfaces/imports";
import * as Entities from "../../core/entities/imports";

export interface AutoRedactCallbackIndexData {
  session: string,
  callbackData: Entities.CallbackData
}

@Service()
export class AutoRedactCallbackIndexUseCase {
  private readonly context: Entities.WorkflowContext = {
    workflow: Entities.Workflow.AUTOREDACT,
    step: Entities.Step.INDEX
  };
  private readonly nextContext: Entities.WorkflowContext = {
    workflow: Entities.Workflow.AUTOREDACT,
    step: Entities.Step.REDACT
  };

  constructor(
    @Inject(TOKENS.IRedactClient) private readonly redactClient: Interfaces.IRedactClient,
    @Inject(TOKENS.ITrackingService) private readonly trackingService: Interfaces.ITrackingService,
  ) { }

  async execute(data: AutoRedactCallbackIndexData): Promise<void> {
    await this.trackingService.trackSuccess(this.context, data.session);

    try {
      await this.redactClient.redactDocument(this.context, data.session, null, Entities.Callback.AUTOREDACT_REDACT);
    }
    catch (error) {
      await this.trackingService.trackError(this.nextContext, data.session, error instanceof Error ? error.message : String(error));
      return;
    }
  }
}