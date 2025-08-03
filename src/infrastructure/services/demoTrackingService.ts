import { Service } from 'typedi';
import { ITrackingService } from '../../core/interfaces/trackingService';
import * as Entities from '../../core/entities/imports';

/** Demo Tracking Service.
 * This service implements the ITrackingService interface for demonstration purposes.
 * It logs tracking information to the console instead of persisting it.
 */
@Service()
export class DemoTrackingService implements ITrackingService {
    async trackSuccess(context: Entities.WorkflowContext, session: string): Promise<void> {
        console.log(`Tracking success for session: ${session}, workflow: ${context.workflow}, step: ${context.step}`);
    }
    async trackError(context: Entities.WorkflowContext, session: string, error: string): Promise<void> {
        console.log(`Tracking: session: ${session}, workflow: ${context.workflow}, step: ${context.step}, status: error, error: ${error}`);
    }


}