import { Inject, Service } from "typedi";
import { Readable } from "stream";

import { MetaData } from "../../core/entities/metadata";
import { StreamService } from "./streamService";

/**
    * Service for handling metadata operations.
    * It provides methods to parse metadata from a Readable stream and validate the metadata structure.
 */
@Service()
export class MetaDataService {


    constructor(
        @Inject() private readonly streamService: StreamService
    ) { }

    /** Parses metadata from a Readable stream.
     * It converts the stream to a string and then parses it as JSON.
     * @param stream - The Readable stream containing metadata.
     * @return A promise that resolves to the parsed metadata.
     * @throws Error if the stream is invalid, empty, or if the metadata structure is invalid.
     */
    async parseStream(stream:Readable): Promise<MetaData> {
        if (!stream || !(stream instanceof Readable)) {
            throw new Error("Invalid stream provided for metadata parsing");
        }
        const text = await this.streamService.streamToString(stream);
        if (!text) {
            throw new Error("Stream is empty or could not be converted to string");
        }
        try {
            const metaData = JSON.parse(text) as MetaData;
            if (!this.validateMetaData(metaData)) {
                throw new Error("Invalid metadata structure");
            }
            return metaData;
        } catch (error) {
            throw new Error("Error parsing metadata");
        }

    }

    /** Validates the provided metadata.
     * It checks if the metadata has a heading with a title, class, and explanation.
     * @param metaData - The metadata to validate.
     * @return True if the metadata is valid, false otherwise.
     */
    validateMetaData(metaData: MetaData): boolean {
        if (!metaData || !metaData.heading || !metaData.heading.title) {
            return false;
        }
        if (!metaData.heading.class || !metaData.heading.explanation) {
            return false;
        }
        return true;
    }
}
