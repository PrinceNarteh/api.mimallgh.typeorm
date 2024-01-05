import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get('/uploads/:folder/:imageName')
  async getProductImage(
    @Param() { folder, imageName }: { folder: string; imageName: string },
    @Res() res: Response,
  ) {
    res.sendFile(join(process.cwd(), `uploads/${folder}/${imageName}`));
  }
}
