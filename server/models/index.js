import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobileNumber: { type: String, required: true, unique: true, index: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const noteSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: Number, required: true },
  subject: { type: String, required: true },
  module: { type: String, required: true },
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  summary: { type: String, default: '' },
  keywords: [{ type: String }],
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

noteSchema.index({ title: 'text', summary: 'text', keywords: 'text', subject: 'text' });
noteSchema.index({ semester: 1, subject: 1, module: 1 });

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['text', 'image', 'pdf', 'file'], default: 'text' },
  content: { type: String },
  createdAt: { type: Date, default: Date.now }
});

messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: -1 });

export const User = mongoose.model('User', userSchema);
export const Note = mongoose.model('Note', noteSchema);
export const Message = mongoose.model('Message', messageSchema);
