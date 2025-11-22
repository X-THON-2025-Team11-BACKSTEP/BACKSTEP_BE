import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError, BadRequestError } from '../../common/error/AppError';

// Ensure upload directories exist
const uploadDir = 'uploads';
const profileDir = path.join(uploadDir, 'profiles');
const projectDir = path.join(uploadDir, 'projects');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir);
if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);

// Storage configuration
const storage = (folder: string) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(uploadDir, folder);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + random + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter (allow images only)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
  }
};

// Limits configuration
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

// Exports
export const uploadProfile = multer({
  storage: storage('profiles'),
  fileFilter: fileFilter,
  limits: limits
});

export const uploadProject = multer({
  storage: storage('projects'),
  fileFilter: fileFilter,
  limits: limits
});

