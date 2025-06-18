import mongoose, { model, Schema } from "mongoose";
import { ConnectionType, ConsumerStatus, TariffCategory } from "../utils/constant";
import { IConsumer } from "../types/authTypes";


const consumerSchema = new Schema<IConsumer>({
  householdId: { type: String, required: true },
  householdHead: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: {
    gewog: { type: Schema.Types.ObjectId, ref: 'Gewog', required: true },
    village: { type: String, required: true },
    houseNumber: { type: String, required: true },
  },
  familySize: { type: Number, required: true },
  connectionType: { type: String, required: true },
  meterNumber: { type: String, required: true },
  connectionDate: { type: Date, required: true },
  status: { type: String, required: true },
  tariffCategory: { type: String, required: true },
}, {
  timestamps: true,
});

const Consumer = mongoose.model<IConsumer>('Consumer', consumerSchema);
export default Consumer;