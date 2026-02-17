/**
 * Workflow defines the various types of workflows that can be executed in the system.
 * Each workflow corresponds to a specific process or action that can be performed.
 */


export class Workflow {
    static readonly AUTORECORD = "autorecord";
    static readonly AUTOREDACT = "autoredact";
    static readonly PROVISION = "provision";
    static readonly ENDORSE = "endorse";
    static readonly INDEX = "index";
    static readonly REPROCESS = "reprocess";
    static readonly CALC = "calc";
    static readonly REDACT = "redact";
}

/**
 * Step defines the various steps that can be part of a workflow.
 * Each step corresponds to a specific action or phase in the workflow process.
 */

export class Step {
    static readonly SESSION = "session";
    static readonly UPLOAD = "upload";
    static readonly INDEX = "index";
    static readonly REPROCESS = "reprocess";
    static readonly CALC = "calc";
    static readonly REDACT = "redact";
    static readonly ENDORSE = "endorse";
    static readonly FEEDBACK = "feedback";
}

/**
 * WorkflowContext defines the context for a workflow in the system.
 * It includes the current workflow type and the current step within that workflow. 
 */
export interface WorkflowContext {
    workflow: string;
    step: string;
}
 