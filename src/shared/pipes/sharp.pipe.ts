import { Injectable, PipeTransform } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import * as sharp from 'sharp';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { customAlphabet } from 'nanoid/async';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

const checkForFolder = (folderName: string) => {
  if (!fs.existsSync(`/uploads/${folderName}`)) {
    fs.mkdirSync(path.join('uploads', folderName), { recursive: true });
  }
};

const transformImage = async ({
  directory,
  image,
  resize = [800],
}: {
  image: Express.Multer.File;
  directory: string;
  resize?: number[];
}): Promise<string> => {
  const genName = await nanoid(32);
  const filename = `${genName}.webp`;
  await sharp(image.buffer)
    .resize(...resize)
    .webp({ effort: 3 })
    .toFile(join('uploads', directory, filename));

  return filename;
};

@Injectable()
export class SharpFileInterceptorPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  constructor(private directory: string) {}

  async transform(image: Express.Multer.File): Promise<string> {
    if (!image) return;
    checkForFolder(this.directory);
    return await transformImage({
      image,
      directory: this.directory,
    });
  }
}

@Injectable()
export class SharpFilesInterceptorPipe
  implements PipeTransform<Array<Express.Multer.File>, Promise<string[]>>
{
  constructor(private directory: string) {}

  async transform(images: Array<Express.Multer.File>): Promise<string[]> {
    if (!images || images.length === 0) return;
    checkForFolder(this.directory);

    let filenames: string[] = [];
    images.map((image) => transformImage({ image, directory: this.directory }));
    return filenames;
  }
}

@Injectable()
export class SharpFieldFilesInterceptorPipe
  implements PipeTransform<any, Promise<{ [key: string]: string }>>
{
  constructor(private directory: string) {}

  async transform(images: any): Promise<{ [key: string]: string }> {
    let filenames: { [key: string]: string } = {};
    const imagesArr = Object.keys(images);
    if (!images || images.length === 0) return;

    checkForFolder(this.directory);

    for (let img of imagesArr) {
      const image = images[img][0];

      const genName = await nanoid(32);
      const filename = `${genName}.webp`;

      if (img === 'banner') {
        await sharp(image.buffer)
          .resize(1024, 750)
          .webp({ effort: 3 })
          .toFile(join('uploads', this.directory, filename));
      } else {
        await sharp(image.buffer)
          .resize(800)
          .webp({ effort: 3 })
          .toFile(join('uploads', this.directory, filename));
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
  constructor(private directory: string) {}

  async transform(images: any): Promise<{ [key: string]: string }> {
    let filenames: { [key: string]: string } = {};
    const imagesArr = Object.keys(images);
    if (!images || images.length === 0) return;

    checkForFolder(this.directory);
    for (let img of imagesArr) {
      const image = images[img][0];

      const genName = await nanoid(32);
      const filename = `${genName}.webp`;

      if (img === 'newBanner') {
        await sharp(image.buffer)
          .resize(1024, 750)
          .webp({ effort: 3 })
          .toFile(join('uploads', this.directory, filename));
      } else {
        await sharp(image.buffer)
          .resize(800)
          .webp({ effort: 3 })
          .toFile(join('uploads', this.directory, filename));
      }

      filenames[img] = filename;
    }

    return filenames;
  }
}

@Injectable()
export class SharpFileFieldsInterceptorPipe
  implements
    PipeTransform<any, Promise<{ logo: string; slide_images: string[] }>>
{
  constructor(private directory: string) {}

  async transform(
    slides: any,
  ): Promise<{ logo: string; slide_images: string[] }> {
    checkForFolder('logo');
    checkForFolder('slide_images');

    console.log(slides);
    let images: {
      logo: string;
      slide_images: string[];
    } = {
      logo: '',
      slide_images: [],
    };

    if (slides['logo']) {
      const filename = await transformImage({
        image: slides['logo'][0],
        directory: 'logo',
      });
      images.logo = filename;
    }

    if (slides['slide_images']) {
      let slide_images: string[] = [];
      for (let image of slides['slide_images']) {
        const filename = await transformImage({
          image,
          directory: 'slide_images',
          resize: [1024, 750],
        });
        console.log(filename);
        slide_images.push(filename);
      }
      images.slide_images = slide_images;
    }
    return images;
  }
}
