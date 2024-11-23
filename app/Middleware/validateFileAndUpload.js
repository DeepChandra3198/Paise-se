const multer = require('multer');
const mime = require('mime-types');

let allowedMimeTypes = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder where the file will be stored
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    // Set the filename to be used
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file) {
      cb(new Error('No file uploaded.'));
      return;
    }

    const fileType = mime.lookup(file.originalname);
    if (allowedMimeTypes.includes(fileType)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel files are allowed.'));
    }
  },
});

// Middleware function to validate Excel file
function validateFileAndUpload(req, res, next) {
  upload.single('excelFile')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific error handling
      return res.status(422).json({
        status: 'error',
        message: err.message,
        data: {},
      });
    } else if (!req.file) {
      return res.status(422).json({
        status: 'error',
        message: 'No file uploaded.',
        data: {},
      });
    } else if (err) {
      // Other errors
      console.log(err);
      return res.status(422).json({
        status: 'error',
        message: err.message,
        data: {},
      });
    }
    // File validation passed, move to the next middleware
    next();
  });
}

module.exports = validateFileAndUpload;
