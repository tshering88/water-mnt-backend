// controllers/dzongkhagController.ts
import { Request, Response } from 'express';
import Dzongkhag from '../models/dzongkhagModels';
import { IDzongkhag } from '../types/authTypes';
import mongoose from 'mongoose';
import { handleError } from '../utils/userUtils';

export const createDzongkhag = async (req: Request, res: Response) => {
  const {
    name,
    nameInDzongkha,
    code,
    region,
    area,
    population,
    coordinates,
    latitude,
    longitude,
    createdBy
  } = req.body
  try {
    const event = await Dzongkhag.create({
      name,
      nameInDzongkha,
      code,
      region,
      area,
      population,
      coordinates,
      latitude,
      longitude,
      createdBy
    })

    res.status(201).json({
      message: '  Dzongkhag added',
      data: event,
    })
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error Create dzongkhag', error: (err as Error).message })
  }
}

export const getDzongkhagById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid Dzongkhag ID' });
      return;
    }

    const dzongkhag = await Dzongkhag.findById(id);
    if (!dzongkhag) {
      res.status(404).json({ message: 'Dzongkhag not found' });
      return;
    }

    res.json(dzongkhag);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get Dzongkhag', error });
  }
};

// Get all users
export const getDzongkhags = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dzongkhag = await Dzongkhag.find().lean();
    res.status(200).json({
      message: 'Users fetched successfully',
      data: dzongkhag,
    });
  } catch (error) {
    handleError(res, error);
  }
}

export const updateDzongkhag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IDzongkhag> = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid Dzongkhag ID' });
      return;
    }

    const dzongkhag = await Dzongkhag.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!dzongkhag) {
      res.status(404).json({ message: 'Dzongkhag not found' });
      return;
    }

    res.json(dzongkhag);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update Dzongkhag', error });
  }
};

export const deleteDzongkhag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid Dzongkhag ID' });
      return;
    }

    const dzongkhag = await Dzongkhag.findByIdAndDelete(id);
    if (!dzongkhag) {
      res.status(404).json({ message: 'Dzongkhag not found' });
      return;
    }

    res.json({ message: 'Dzongkhag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Dzongkhag', error });
  }
};




