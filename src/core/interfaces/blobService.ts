import { Service } from 'typedi';
import { Readable } from 'stream';

/**
 * Interface for Blob Service.
 * Provides methods for uploading and downloading blobs.
 */
export interface IBlobService {
  /**
   * Uploads content to a specified URL.
   * @param url - The URL where the content will be uploaded.
   * @param content - The content to upload, provided as a Readable stream.
   * @returns A promise that resolves when the upload is complete.
   */
  upload(url: string, content: Readable): Promise<void>;
  /**
   * Downloads content from a specified URL.
   * @param url - The URL from which the content will be downloaded.
   * @returns A promise that resolves to a Readable stream containing the downloaded content.
   */
  download(url: string): Promise<Readable>;
}
