import * as Entities from '../entities/imports';

/** Interface for Index Service Client.
 * This interface defines the methods for interacting with the Tabularium API.
 * It includes methods for indexing documents.
 */
export interface IIndexClient {
    /**
     * Indexes a document with the specified choices and callback.
     * @param context - The workflow context containing workflow and step information.
     * @param session - The session identifier for the document.
     * @param document - The document to index.
     * @param choice - The choices associated with the document.
     * @param callback - The callback type for the operation.
     * @returns A promise that resolves when the indexing is complete.
     */
    indexDocument(context:Entities.WorkflowContext, session: string, document: string, choice: Entities.ChoiceItem[], callback: string): Promise<void>;
}