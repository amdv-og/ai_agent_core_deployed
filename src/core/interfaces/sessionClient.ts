import * as Entities from '../entities/imports';

/** Interface for Session Service Client.
 * This interface defines the methods for interacting with the Tabularium API.
 * It includes methods for session management.
 */
export interface ISessionClient {
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
}