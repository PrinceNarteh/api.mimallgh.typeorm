import { Injectable, PipeTransform } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import * as sharp from 'sharp';
import { join } from 'path';

@Injectable()
export class SharpFilesInterceptorPipe
  implements PipeTransform<Array<Express.Multer.File>, Promise<string[]>>
{
  _directory: string;
  constructor(directory: string) {
    this._directory = directory;
  }

  async transform(images: Array<Express.Multer.File>): Promise<string[]> {
    let filenames: string[] = [];

    for (let image of images) {
      const genName = createId();
      const filename = `${genName}.webp`;

      console.log(image);

      await sharp(image.buffer)
        .resize(800)
        .webp({ effort: 3 })
        .toFile(join('uploads', this._directory, filename));

      filenames.push(filename);
    }
    return filenames;
  }
}

@Injectable()
export class SharpFileInterceptorPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  _directory: string;
  constructor(directory: string) {
    this._directory = directory;
  }

  async transform(image: Express.Multer.File): Promise<string> {
    const genName = createId();
    const filename = `${genName}.webp`;

    console.log(image);

    await sharp(image.buffer)
      .resize(800)
      .webp({ effort: 3 })
      .toFile(join('uploads', this._directory, filename));

    return filename;
  }
}
