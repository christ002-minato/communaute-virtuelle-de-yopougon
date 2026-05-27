import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    description: {
      type: String,
      default: '',
    },
    image_url: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    link_url: {
      type: String,
      default: '',
    },
    album: {
      type: String,
      default: 'Activites CVY',
    },
    activity_date: {
      type: Date,
      default: null,
    },
    is_public: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', galleryItemSchema);
