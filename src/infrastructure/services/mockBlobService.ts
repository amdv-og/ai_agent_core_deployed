import { Service, Token } from 'typedi';
import { Readable } from 'stream';

const { BlockBlobClient } = require('@azure/storage-blob');

import { IBlobService } from '../../core/interfaces/blobService';
import { MetaData } from '../../core/entities/metadata';


/** Mock metadata */
const metaData: MetaData = {
  heading: {
    title: "Mock Document",
    class: "class",
    explanation: "explanation"
  },
  secrets: [],
  indexes: [],
};

/** Mock Blob Service.
 * This service implements the IBlobService interface for testing purposes.
 * It simulates the upload and download of blobs without actual storage operations.
 * This is useful for unit tests and development environments where real storage access is not required.
 */
@Service()
export class MockBlobService implements IBlobService {
  async upload(url: string, content: Readable): Promise<void> {
  }

  async download(url: string): Promise<Readable> {
    const stream = new Readable();
    if (url === "https://example.com/test.json") {
      stream.push(JSON.stringify(metaData));
    }
    else {
      stream.push("Blob content");
    }
    stream.push(null);
    return stream;
  }
}

