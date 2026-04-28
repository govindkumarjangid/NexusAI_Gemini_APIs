import cloudinary from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'NexusAi',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', "avif"],
    },
    format: 'webp',
    resource_type: 'image',
    transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' }
    ],
    public_id: (req, file) => {
        const cleanName = file.originalname.split('.')[0].replace(/\s+/g, '-');
        return `${cleanName}-${Date.now()}`;
    },
})

const upload = multer({ storage: storage });

export { cloudinary };
export default upload;