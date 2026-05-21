import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    join_date: {
      type: Date,
      default: Date.now,
    },
    points: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
    },
    reputation: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        type: String,
      },
    ],
    contributions_count: {
      type: Number,
      default: 0,
    },
    last_active: {
      type: Date,
      default: Date.now,
    },
    is_verified: {
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

export default mongoose.models.Member || mongoose.model('Member', memberSchema);
