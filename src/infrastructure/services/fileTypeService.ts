import { Service, Token } from 'typedi';

/**
 * Service for determining file types based on MIME types.
 */
@Service()
export class FileTypeService {
    
    /**
     * A map of MIME types to their corresponding file types.
     * This map is used to determine the file type based on the content type.
     */
    private readonly mimeTypes: Map<string, string> = new Map([
        ["application/pdf", "pdf"],
        ['image/tiff', "tiff"]
    ]);

    /**
     * Retrieves the file type based on the provided content type.
     * 
     * @param contentType - The MIME type of the file.
     * @returns The corresponding file type
     * @throws Error if the content type is unsupported.
     */
    getFileType(contentType: string): string {
        const type = this.mimeTypes.get(contentType.trim().toLowerCase());
        if (!type) {
            throw new Error(`Unsupported file type: ${contentType}`);
        }
        return type;
    }
}

