import * as Entities from '../entities/imports';

/** Interface for Compute Service Client.
 * This interface defines the methods for interacting with the Tabularium API.
 * It includes methods for computation.
 */
export interface IComputeClient {
    /**
     * Calculates metadata for a document with a callback.
     * @param context - The workflow context containing workflow and step information.
     * @param session - The session identifier for the document.
     * @param metaData - The metadata associated with the document, can be null if not available.
     * @param callback - The callback type for the operation.
     * @returns A promise that resolves when the calculation is complete.
     */
    calcDocument(context:Entities.WorkflowContext, session: string, metaData: Entities.MetaData | null, callback: string): Promise<void>;
}