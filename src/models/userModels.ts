import { model, Schema } from 'mongoose';
import { UserRole } from '../utils/constant';
import { IUser } from '../types/authTypes';


// Create schema
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  cid: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: Object.values(UserRole), // ✅ Converts enum to values array
    default: UserRole.CONSUMER
  },
  password: { type: String },
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
