import slugify from "slugify";
import productModel from "../models/productModel.js";
import multer from "multer";
import fs from "fs";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this uploads directory exists
  },
  filename: function (req, file, cb) {
    // You can use the original name or add a timestamp for uniqueness
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export const createProductController = async (req, res) => {
  upload.fields([
    { name: "photo", maxCount: 1 },
    // Add other fields if needed
  ])(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).send({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).send({ error: err.message });
    }

    // If this point is reached, file(s) have been uploaded successfully.
    try {
      const { name, description, price, category, quantity, shipping } =
        req.body;
      const photo = req.files["photo"]
        ? req.files["photo"][0].filename
        : undefined;

      // Validation
      if (!name || !description || !price || !category || !quantity || !photo) {
        return res
          .status(400)
          .send({ error: "All fields including photo are required" });
      }

      // Proceed with your logic to save the product
      const product = new productModel({
        name,
        description,
        price,
        category,
        quantity,
        shipping,
        photo, // Assuming you are storing the filename or path
        slug: slugify(name),
      });

      await product.save();
      res.status(201).send({
        success: true,
        message: "Product Created Successfully",
        product,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error: error.message,
        message: "Error in creating product",
      });
    }
  });
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  upload.fields([
    { name: "photo", maxCount: 1 },
    // Add other fields if needed
  ])(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).send({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).send({ error: err.message });
    }

    try {
      const { name, description, price, category, quantity, shipping } =
        req.body;
      let updateData = {
        name,
        description,
        price,
        category,
        quantity,
        shipping,
        // Only update slug if the name is changed
        ...(name && { slug: slugify(name) }),
      };

      // Check for photo and handle accordingly
      if (req.files && req.files.photo && req.files.photo[0]) {
        const photo = req.files.photo[0];
        updateData.photo = photo.filename; // Assuming you want to just store the filename
      }

      // Validation
      if (!name || !description || !price || !category || !quantity) {
        return res.status(400).send({ error: "All fields are required" });
      }

      // Find by ID and update the product
      const updatedProduct = await productModel.findByIdAndUpdate(
        req.params.pid,
        updateData,
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).send({ error: "Product not found" });
      }

      res.status(200).send({
        success: true,
        message: "Product Updated Successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        error: error.message,
        message: "Error in updating product",
      });
    }
  });
};
