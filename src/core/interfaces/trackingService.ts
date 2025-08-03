import * as Entities from '.././entities/imports';

/** Interface for Tracking Service.
 * Provides methods to track the success and error of various steps in a session.
 * Each method takes a session identifier and a step, and optionally an error message for error tracking.
 */
export interface ITrackingService {
  /**
   * Tracks the success of a step in a session.
   * @param session - The identifier for the session.
   * @param step - The step that was successful.
   * @returns A promise that resolves when the tracking is complete.
   */
  trackSuccess(context: Entities.WorkflowContext, session: string): Promise<void>;
  /**
   * Tracks an error that occurred during a step in a session.
   * @param session - The identifier for the session.
   * @param step - The step where the error occurred.
   * @param error - A description of the error that occurred.
   * @returns A promise that resolves when the tracking is complete.
   */
  trackError(context: Entities.WorkflowContext, session: string, error: string): Promise<void>;


}