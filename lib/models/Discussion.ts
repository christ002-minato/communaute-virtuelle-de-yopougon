import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema(
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
      required: [true, 'Please provide content'],
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
    view_count: {
      type: Number,
      default: 0,
    },
    comment_count: {
      type: Number,
      default: 0,
    },
    is_pinned: {
      type: Boolean,
      default: false,
    },
    is_locked: {
      type: Boolean,
      default: false,
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

export default mongoose.models.Discussion || mongoose.model('Discussion', discussionSchema);
