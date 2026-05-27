import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
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
      default: '',
    },
    project_url: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['site-web', 'graphisme', 'mobile', 'autre'],
      default: 'autre',
    },
    author_name: {
      type: String,
      default: '',
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

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
