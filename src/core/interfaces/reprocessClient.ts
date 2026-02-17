import * as Entities from '../entities/imports';

/** Interface for Refine Service Client.
 * This interface defines the methods for interacting with the Tabularium API.
 * It includes methods for document reprocessing.
 */
export interface IReprocessClient {

    /**
     * Reprocesses a document segment with a message and callback.
     * @param context - The workflow context containing workflow and step information.
     * @param session - The session identifier for the document.
     * @param segment - The segment of the document to reprocess.
     * @param callback - The callback type for the operation.
     * @returns A promise that resolves when the reprocessing is complete.
     */ 
    reprocessDocument(context:Entities.WorkflowContext, session: string, segment: string, callback: string): Promise<void>;
}