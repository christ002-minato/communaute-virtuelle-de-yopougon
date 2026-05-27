import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    image_url: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    target_url: {
      type: String,
      default: '',
    },
    placement: {
      type: String,
      enum: ['banner', 'sidebar'],
      default: 'banner',
    },
    sponsor_name: {
      type: String,
      default: '',
    },
    is_active: {
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

export default mongoose.models.Advertisement || mongoose.model('Advertisement', advertisementSchema);
