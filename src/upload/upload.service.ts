import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';

@Injectable()
export class UploadService {
  private client: S3Client;

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get('r2.endpoint');

    this.client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: this.config.get('r2.accessKey'),
        secretAccessKey: this.config.get('r2.secretAccessKey'),
      },
    });
  }
  async create(file: { fileName: string; fileType: string; body: Buffer }) {
    const name = `${randomUUID()}${extname(file.fileName)}`;
    const bucket = this.config.get('r2.bucket');

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: name,
        ContentType: file.fileType,
        Body: file.body,
      }),
    );
    return { url: name };
  }
}
