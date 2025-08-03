import * as Entities from '../entities/imports';

/** Interface for AI Service Client.
 * This interface defines the methods for interacting with the AI service.
 * It includes methods for session management, document processing, and feedback handling.
 */
export interface IAISvcClient {
    /**
     * Retrieves a session token based on the workflow context and session ID.
     * @param context - The workflow context containing workflow and step information.
     * @param sessionId - The identifier for the session.
     * @returns A promise that resolves to the session token.
     */
    getSession(context:Entities.WorkflowContext, sessionId: string): Promise<Entities.SessionToken>;
    /**
     * Creates a new session for a document.
     * @param context - The workflow context containing workflow and step information.
     * @param document - The document to create a session for.
     * @returns A promise that resolves to the session identifier.
     */
    createSession(context:Entities.WorkflowContext, document: string): Promise<string>;
    /**
     * Indexes a document with the specified choices and callback.
     * @param context - The workflow context containing workflow and step information.
     * @param session - The session identifier for the document.
     * @param document - The document to index.
     * @param choice - The choices associated with the document.
     * @param callback - The callback type for the operation.
     * @returns A promise that resolves when the indexing is complete.
     */
    indexDocument(context:Entities.WorkflowContext, session: string, document: string, choice: Entities.ChoiceItem[], callback: Entities.Callback): Promise<void>;
    /**
     * Provides feedback on a document segment.
     * @param context - The workflow context containing workflow and step information.
     * @param session - The session identifier for the document.
     * @param segment - The segment of the document to provide feedback on.
     * @param message - The feedback message.
     * @returns A promise that resolves when the feedback is processed.
     */
    feedbackDocument(context:Entities.WorkflowContext, session: string, segment: string, message: string): Promise<Entities.Feedback>;
    /**
     * Refines a document segment with a message and callback.
     * @param context - The workflow context containing workflow and step information.
     * @param session - The session identifier for the document.
     * @param segment - The segment of the document to refine.
     * @param message - The refinement message.
     * @param callback - The callback type for the operation.
     * @returns A promise that resolves when the refinement is complete.
     */
    refineDocument(context:Entities.WorkflowContext, session: string, segment: string, message: string, callback: Entities.Callback): Promise<void>;
    /**
     * Calculates metadata for a document with a callback.
     * @param context - The workflow context containing workflow and step information.
     * @param session - The session identifier for the document.
     * @param metaData - The metadata associated with the document, can be null if not available.
     * @param callback - The callback type for the operation.
     * @returns A promise that resolves when the calculation is complete.
     */
    calcDocument(context:Entities.WorkflowContext, session: string, metaData: Entities.MetaData | null, callback: Entities.Callback): Promise<void>;
    /**
     * Redacts a document with metadata and callback.
     * @param context - The workflow context containing workflow and step information.
     * @param session - The session identifier for the document.
     * @param metaData - The metadata associated with the document, can be null if not available.
     * @param callback - The callback type for the operation.
     * @returns A promise that resolves when the redaction is complete.
     */
    redactDocument(context:Entities.WorkflowContext, session: string, metaData: Entities.MetaData | null, callback: Entities.Callback): Promise<void>;
    /**
     * Endorses a document with metadata and callback.
     * @param context - The workflow context containing workflow and step information.
     * @param session - The session identifier for the document.
     * @param metaData - The metadata associated with the document, can be null if not available.
     * @param callback - The callback type for the operation.
     * @returns A promise that resolves when the endorsement is complete.
     */
    endorseDocument(context:Entities.WorkflowContext, session: string, metaData: Entities.MetaData, callback: Entities.Callback): Promise<void>;
}