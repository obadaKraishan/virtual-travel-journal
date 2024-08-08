import express from 'express';
import JournalEntry from '../models/JournalEntry.js';

const router = express.Router();

// Get all journal entries
router.get('/', async (req, res) => {
  const journalEntries = await JournalEntry.find();
  res.json(journalEntries);
});

// Add a new journal entry
router.post('/', async (req, res) => {
  const { title, location, date, description, photos, mapLocation } = req.body;
  const newJournalEntry = new JournalEntry({ title, location, date, description, photos, mapLocation });
  await newJournalEntry.save();
  res.status(201).json(newJournalEntry);
});

// Update a journal entry
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, location, date, description, photos, mapLocation } = req.body;
  const updatedJournalEntry = await JournalEntry.findByIdAndUpdate(id, { title, location, date, description, photos, mapLocation }, { new: true });
  res.json(updatedJournalEntry);
});

// Delete a journal entry
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await JournalEntry.findByIdAndDelete(id);
  res.status(204).end();
});

export default router;
