import * as Entities from '../entities/imports';

/** Interface for Record Service Client.
 * This interface defines the methods for interacting with the Tabularium API.
 * It includes methods for document endorsement.
 */
export interface IRecordClient {
    /**
     * Endorses a document with metadata and callback.
     * @param context - The workflow context containing workflow and step information.
     * @param session - The session identifier for the document.
     * @param metaData - The metadata associated with the document, can be null if not available.
     * @param callback - The callback type for the operation.
     * @returns A promise that resolves when the endorsement is complete.
     */
    endorseDocument(context:Entities.WorkflowContext, session: string, metaData: Entities.MetaData, callback: string): Promise<void>;
}