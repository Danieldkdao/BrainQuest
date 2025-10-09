import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        console.error("Error deleting image:", error);
    }
};
export default cloudinary;
