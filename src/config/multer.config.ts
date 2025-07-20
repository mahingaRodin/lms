import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/plans',
    filename: (req, file, callback) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return callback(new Error('Only PDF files are allowed!'), false);
    }
    callback(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
};
