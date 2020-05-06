const router = require("express").Router();
const Product = require("../models/product");

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3({
  accessKeyId: `${process.env.AMAZON_KEY_ID}`,
  secretAccessKey: `${process.env.AMAZON_KEY_SECRET}`,
});
const checkJWT = require("../middlewares/check-jwt");
const faker = require('faker')

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: `${process.env.AMAZON_BUCKET}`,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

router
  .route("/products")
  .get(checkJWT, (req, res, next) => {
    Product.find({ owner: req.decoded.user._id })
      .populate("owner") //populate show info of user instead of his id.
      .populate("category")
      .exec((err, products) => {
        if (products) {
            console.log('prod: ',products)
          res.json({
            success: true,
            message: "Products",
            products: products,
          });
        }
      });
  })
  .post([checkJWT, upload.single("product_picture")], (req, res, next) => {
    let product = new Product();
    product.owner = req.decoded.user._id;
    product.category = req.body.categoryId;
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
     product.image = req.file.location;
    product.save();
    res.json({
      success: true,
      message: "Successfully Added the product",
    });
  });

//just for testing
router.get('/faker/test',(req,res,next) => {
    for(i=0;i<20;i++){
        let product = new Product();
        product.category="5eae6bf403822a13fc6f1b85"
        product.owner = "5eaace5aead7892138114e16";
        product.image = faker.image.cats()
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words()
        product.price = faker.commerce.price()
        product.save()

    }
    res.json({
        message:"Successfully added 20 pictures"
    })
})
module.exports = router;
