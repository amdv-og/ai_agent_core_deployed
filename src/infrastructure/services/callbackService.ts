import { Service } from "typedi";
import * as Entities from "../../core/entities/imports";

@Service()
export class CallbackService {


    /**
     * Validates the provided callback data.
     * It checks if the callback data has a valid status and data.
     *
     * @param callbackData - The callback data to validate.
     * @returns True if the callback data is valid, false otherwise.
     */
    validateCallbackData(callback: Entities.CallbackData): boolean {
        if (!callback || typeof callback.status !== "string") {
            return false;
        }

        const validStatuses = Object.values(Entities.CallbackStatus);

        if (!validStatuses.includes(callback.status)) {
            return false;
        }
        return true;
    }

    validateCallbackSucessData(callback: Entities.CallbackData): boolean {
        if (!this.validateCallbackData(callback)) {
            return false;
        }

        if (callback.status !== Entities.CallbackStatus.SUCCESS) {
            return false;
        }
        return true;
    }

}
