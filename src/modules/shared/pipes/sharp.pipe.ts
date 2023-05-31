import { Injectable, PipeTransform } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import sharp from 'sharp';
import { join } from 'path';

interface ISharpPipe {
  image: Express.Multer.File;
  directory: string;
}

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  _directory: string;
  constructor(directory: string) {
    this._directory = directory;
  }

  async transform(image: Express.Multer.File): Promise<string> {
    const genName = createId();
    const filename = `${genName}.webp`;

    await sharp(image.buffer)
      .resize(800)
      .webp({ effort: 3 })
      .toFile(join('uploads', this._directory, filename));

    return filename;
  }
}
