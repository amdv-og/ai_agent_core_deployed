import { Service } from "typedi";
import { Readable } from "stream";

/**
 * Service for handling stream operations.
 * It provides methods to convert a Readable stream to a string.
 */
@Service()
export class StreamService {
    /**
     * Converts a Readable stream to a string.
     * It listens for 'data', 'end', 'error', and 'close' events on the stream.
     *
     * @param readableStream - The Readable stream to convert.
     * @returns A promise that resolves to the concatenated string from the stream.
     */
    async streamToString(readableStream: Readable): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: string[] = [];

            readableStream.on("data", (chunk) => {
                try {
                    chunks.push(chunk.toString());
                } catch (err) {
                    reject(new Error("Error processing stream data"));
                }
            });

            readableStream.on("end", () => {
                resolve(chunks.join(""));
            });

            readableStream.on("error", (err) => {

                reject(new Error("Error reading stream"));
            });

            readableStream.on("close", () => {
                reject(new Error("Stream closed"));
            });
        });
    }
}

