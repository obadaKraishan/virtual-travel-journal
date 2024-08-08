import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  photos: [String], // Array of photo URLs
  mapLocation: { type: String, required: true } // e.g., "lat,lng"
});

export default mongoose.model('JournalEntry', journalEntrySchema);
