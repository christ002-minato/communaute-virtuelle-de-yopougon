import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: null,
    },
    file_url: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ['article', 'video', 'document', 'link', 'image'],
      default: 'article',
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      default: 'general',
    },
    tags: [
      {
        type: String,
      },
    ],
    download_count: {
      type: Number,
      default: 0,
    },
    view_count: {
      type: Number,
      default: 0,
    },
    is_public: {
      type: Boolean,
      default: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
