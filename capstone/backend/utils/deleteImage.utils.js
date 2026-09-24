import cloudinary from "../config/cloudinary.config.js";

const deleteImage = async (publicId) => {
  if (!publicId) return null;
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};
export default deleteImage;
