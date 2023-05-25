import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';

const multerFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
        // upload only png and jpg format
        return cb(new Error('Please upload an image'));
    }
    cb(null, true);
};

const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationFolder = './images/profilepictures';
      fs.ensureDirSync(destinationFolder); // Create folder if it doesn't exist synchronously
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        const fileName = `profile-${req.params.id}`;
        cb(null, fileName + path.extname(file.originalname));
    }
});

const spacePictureStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const id = req.params.id;
      const spaceId = req.params.spaceId;
      const destinationFolder = `./images/spacepictures/${id}/${spaceId}`;
      fs.ensureDirSync(destinationFolder); // Create folder if it doesn't exist synchronously
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        const fileName = `space-${req.params.spaceId}-${Date.now()}`;
        cb(null, fileName + path.extname(file.originalname));
    }
});

const uploadProfilePicture = multer({ storage: profilePictureStorage, fileFilter: multerFilter });
const uploadSpacePictures = multer({ storage: spacePictureStorage, fileFilter: multerFilter });

export { uploadProfilePicture, uploadSpacePictures };