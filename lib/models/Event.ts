import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    description: {
      type: String,
      default: '',
    },
    start_date: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    end_date: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      default: '',
    },
    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    category: {
      type: String,
      default: 'general',
    },
    max_attendees: {
      type: Number,
      default: null,
    },
    is_virtual: {
      type: Boolean,
      default: false,
    },
    meeting_url: {
      type: String,
      default: null,
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

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
