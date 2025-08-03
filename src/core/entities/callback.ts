
/**
 * The Callback enum is used to identify the type of callback being processed,
 * allowing for better organization and handling of callback requests.
 */
export enum Callback {
    INDEX = "index",
    REFINE = "refine",
    CALC = "calc",
    PROVISION_INDEX = "provision/index",
    PROVISION_CALC = "provision/calc",
    REDACT = "redact",
    AUTOREDACT_INDEX = "autoredact/index",
    AUTOREDACT_REDACT = "autoredact/redact",
    ENDORSE = "endorse",
    AUTORECORD_INDEX = "autorecord/index",
    AUTORECORD_CALC = "autorecord/calc",
    AUTORECORD_REDACT = "autorecord/redact",
    AUTORECORD_ENDORSE = "autorecord/endorse",

}

/**
 * CallbackStatus is an enum representing the status of a callback operation.
 * It can be used to indicate whether the operation was successful, encountered an error, or is still processing.
 */
export enum CallbackStatus {
    SUCCESS = "success",
    ERROR = "error",
    PROCESSING = "processing"
}

/**
 * CallbackData is an interface that defines the structure of the data returned by a callback operation.
 * It includes a status to indicate the result of the operation and a data field for any additional information.
 */
export interface CallbackData {
    status: CallbackStatus,
    data: string
}