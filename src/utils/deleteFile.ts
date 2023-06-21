import * as fs from 'fs';
import { join } from 'path';

export const deleteFile = (fileName: string, entity: string) => {
  const path = `${join(process.cwd(), 'uploads', entity, fileName)}`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};
