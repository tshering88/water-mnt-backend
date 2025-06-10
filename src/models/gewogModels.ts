import mongoose, { model, Schema } from "mongoose";
import { IGewog } from "../types/authTypes";

const gewogSchema = new Schema({
  name: { type: String, required: true },
  nameInDzongkha: String,
  dzongkhag: { type: Schema.Types.ObjectId, ref: "Dzongkhag", required: true },
  area: Number,
  population: Number,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
}, { timestamps: true });

export default model<IGewog>('Gewog', gewogSchema)