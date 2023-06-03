import { Injectable, PipeTransform } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import * as sharp from 'sharp';
import { join } from 'path';
import { customAlphabet } from 'nanoid/async';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

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

    await sharp(image.buffer)
      .resize(800)
      .webp({ effort: 3 })
      .toFile(join('uploads', this._directory, filename));

    return filename;
  }
}

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

    if (images.length === 0) return;

    for (let image of images) {
      const genName = await nanoid(32);
      const filename = `${genName}.webp`;

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
export class SharpFieldFilesInterceptorPipe
  implements PipeTransform<any, Promise<{ [key: string]: string }>>
{
  _directory: string;
  constructor(directory: string) {
    this._directory = directory;
  }

  async transform(images: any): Promise<{ [key: string]: string }> {
    let filenames: { [key: string]: string } = {};
    const imagesArr = Object.keys(images);

    for (let img of imagesArr) {
      const image = images[img][0];

      const genName = await nanoid(32);
      const filename = `${genName}.webp`;

      if (img === 'banner') {
        await sharp(image.buffer)
          .resize(1024, 750)
          .webp({ effort: 3 })
          .toFile(join('uploads', this._directory, filename));
      } else {
        await sharp(image.buffer)
          .resize(800)
          .webp({ effort: 3 })
          .toFile(join('uploads', this._directory, filename));
      }

      filenames[img] = filename;
    }

    return filenames;
  }
}

@Injectable()
export class SharpUpdateFieldFilesInterceptorPipe
  implements PipeTransform<any, Promise<{ [key: string]: string }>>
{
  _directory: string;
  constructor(directory: string) {
    this._directory = directory;
  }

  async transform(images: any): Promise<{ [key: string]: string }> {
    let filenames: { [key: string]: string } = {};
    const imagesArr = Object.keys(images);

    for (let img of imagesArr) {
      const image = images[img][0];

      const genName = await nanoid(32);
      const filename = `${genName}.webp`;

      if (img === 'newBanner') {
        await sharp(image.buffer)
          .resize(1024, 750)
          .webp({ effort: 3 })
          .toFile(join('uploads', this._directory, filename));
      } else {
        await sharp(image.buffer)
          .resize(800)
          .webp({ effort: 3 })
          .toFile(join('uploads', this._directory, filename));
      }

      filenames[img] = filename;
    }

    return filenames;
  }
}
