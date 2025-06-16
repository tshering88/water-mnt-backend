// models/dzongkhagModel.ts
import mongoose, { model, Schema } from 'mongoose';
import { RegionType } from '../utils/constant';
import { IDzongkhag } from '../types/authTypes';


const dzongkhagSchema = new Schema({
  name: { type: String, required: true },
  nameInDzongkha: String,
  code: { type: String, required: true, unique: true },
  region: {
    type: String,
    enum: Object.values(RegionType),
    required: true,
  },
  area: Number,
  population: Number,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },

}, { timestamps: true });

export default model<IDzongkhag>('Dzongkhag', dzongkhagSchema);
