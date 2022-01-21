const express = require("express");
const router = express.Router();
const multer = require('multer');
const authCheck = require('../middleware/authCheck');
const path = require('path')
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3')

require('dotenv').config()

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

 const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error("filetype not allowed"), false);
  }
}; 

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    fileFilter: fileFilter,
    key: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
   }
  })
})



router.post("/",authCheck, upload.single('Image'), (req, res, next) => {

        res.status(200).json({
          link: req.file.location
        })

});

module.exports = router;

/*  const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
     cb(null, Date.now() + path.extname(file.originalname));
  }
 }); */

 /* const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}); */