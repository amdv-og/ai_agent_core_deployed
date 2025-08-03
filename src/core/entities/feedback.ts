/**
 * @file Feedback entity definition
 * The Feedback interface represents user feedback on a specific segment, including a message, acceptance status, and optional data.
 */
export interface Feedback {
    segment: string;
    message: string;
    accepted: boolean;
    data: String | null;
}
