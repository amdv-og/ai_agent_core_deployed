/**
 * Workflow defines the various types of workflows that can be executed in the system.
 * Each workflow corresponds to a specific process or action that can be performed.
 */
export enum Workflow {
    AUTORECORD = "autorecord",
    AUTOREDACT = "autoredact",
    PROVISION = "provision",
    ENDORSE = "endorse",
    INDEX = "index",
    REFINE = "refine",
    CALC = "calc",
    REDACT = "redact",
}
/**
 * Step defines the various steps that can be part of a workflow.
 * Each step corresponds to a specific action or phase in the workflow process.
 */

export enum Step {
    SESSION = "session",
    UPLOAD = "upload", 
    INDEX = "index",
    REFINE = "refine",
    CALC = "calc",
    REDACT = "redact",
    ENDORSE = "endorse",
    FEEDBACK = "feedback",
}

/**
 * WorkflowContext defines the context for a workflow in the system.
 * It includes the current workflow type and the current step within that workflow. 
 */
export interface WorkflowContext {
    workflow: Workflow;
    step: Step;
}
 