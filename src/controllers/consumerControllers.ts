import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Consumer from '../models/consumerModel'

// Create Consumer
export const createConsumer = async (req: Request, res: Response): Promise<void> => {
  try {
    const consumer = await Consumer.create(req.body);

    const populatedConsumer = await Consumer.findById(consumer._id)
      .populate({ path: 'householdHead', select: 'name cid phone' })
      .populate({ path: 'address.gewog', select: 'name nameInDzongkha' });

    res.status(201).json({
      message: 'Consumer created successfully',
      data: populatedConsumer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create consumer', error });
  }
};


// Get all Consumer
export const getAllConsumers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      search,
      gewog,
      status,
      tariffCategory,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query as Record<string, string>;

    const filters: any = {};

    // Filter by gewog, status, tariffCategory
    if (gewog) filters['address.gewog'] = gewog;
    if (status) filters.status = status;
    if (tariffCategory) filters.tariffCategory = tariffCategory;

    // Optional search on householdHead.name or householdHead.cid
    if (search) {
      filters.$or = [
        { 'householdHead.name': { $regex: search, $options: 'i' } },
        { 'householdHead.cid': { $regex: search, $options: 'i' } },
      ];
    }

    // Count total for pagination
    const total = await Consumer.countDocuments(filters);

    const consumers = await Consumer.find(filters)
      .populate({ path: 'householdHead', select: 'name cid phone' })
      .populate({ path: 'address.gewog', select: 'name nameInDzongkha' })
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.status(200).json({
      data: consumers,
      meta: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch consumers', error });
  }
};


// Get Consumer By ID
export const getConsumerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const consumer = await Consumer.findById(id)
      .populate({ path: 'householdHead', select: 'name cid phone' })
      .populate({ path: 'address.gewog', select: 'name nameInDzongkha' });

    if (!consumer) {
       res.status(404).json({ message: 'Consumer not found' })
       return;
    }

    res.status(200).json({ data: consumer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch consumer', error });
  }
};

// Update Consumer
export const updateConsumer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedConsumer = await Consumer.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate({ path: 'householdHead', select: 'name cid phone' })
      .populate({ path: 'address.gewog', select: 'name nameInDzongkha' });

    if (!updatedConsumer) {
       res.status(404).json({ message: 'Consumer not found' })
       return;
    }

    res.status(200).json({
      message: 'Consumer updated successfully',
      data: updatedConsumer,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update consumer', error });
  }
};


// Delete Consumer
export const deleteConsumer = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid Consumer ID' });
    return;
  }

  try {
    const deletedConsumer = await Consumer.findByIdAndDelete(id);
    if (!deletedConsumer) {
      res.status(404).json({ message: 'Consumer not found' });
      return;
    }

    res.status(200).json({ message: 'Consumer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete consumer', error });
  }
};
