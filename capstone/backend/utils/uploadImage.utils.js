import cloudinary from "../config/cloudinary.config.js";

const uplaodImage = (fileBuffer, folder = "dp") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    stream.end(fileBuffer);
  });
};

export default uplaodImage;
