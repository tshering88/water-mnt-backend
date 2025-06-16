import { Request, Response } from 'express';
import Gewog from '../models/gewogModels';
import mongoose, { Types } from 'mongoose';
import { IGewog } from '../types/authTypes';
import { handleError } from '../utils/userUtils';


// Create Gewog
export const createGewog = async (req: Request, res: Response) => {
  const {
    name,
    nameInDzongkha,
    dzongkhag,
    area,
    population,
    coordinates,
    createdBy,
  } = req.body;

  try {
    const gewog = await Gewog.create({
      name,
      nameInDzongkha,
      dzongkhag: new Types.ObjectId(dzongkhag as string), // Convert string to ObjectId
      area,
      population,
      coordinates,
      createdBy,
    });

    res.status(201).json({
      message: 'Gewog added',
      data: gewog,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error creating Gewog', error: (err as Error).message });
  }
};


// Get gewogs by id/ single gewog
export const getGewogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid Gewog ID' });
      return;
    }

    const gewog = await Gewog.findById(id).populate('dzongkhag');
    if (!gewog) {
      res.status(404).json({ message: 'Gewog not found' });
      return;
    }

    res.json(gewog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get Gewog', error });
  }
};

// Get all Gewogs
export const getGewogs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const gewogs = await Gewog.find().populate('dzongkhag').lean();
    res.status(200).json({
      message: 'Gewogs fetched successfully',
      data: gewogs,
    });
  } catch (error) {
    handleError(res, error);
  }
};


// Update gewog informaton
export const updateGewog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IGewog> = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid Gewog ID' });
      return;
    }

    const gewog = await Gewog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!gewog) {
      res.status(404).json({ message: 'Gewog not found' });
      return;
    }

    res.json(gewog);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update Gewog', error });
  }
};

// Delete gewog
export const deleteGewog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid Gewog ID' });
      return;
    }

    const gewog = await Gewog.findByIdAndDelete(id);
    if (!gewog) {
      res.status(404).json({ message: 'Gewog not found' });
      return;
    }

    res.json({ message: 'Gewog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Gewog', error });
  }
};
