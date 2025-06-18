import { Types } from 'mongoose';
import { ConnectionType, ConsumerStatus, RegionType, TariffCategory, UserRole } from '../utils/constant';

declare global {
  namespace Express {
    interface Request {
      user?: IUser & Document
      userId?: string;
    }
  }
}

export type CustomJwtPayload = {
  userId: string
  phone: string
  cid: string
  role: string
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  cid: string;
  role: UserRole;
  password: string;
}

export type CoordinatesType = {
  latitude?: number;
  longitude?: number;
}

export type IDzongkhag = {

  _id?: Types.ObjectId; // optional if creating new entries
  name: string;
  nameInDzongkha?: string;
  code: string;
  region: RegionType;
  area?: number; // in sq km
  population?: string;
  coordinates?: CoordinatesType
};

export type IGewog = {
  _id?: Types.ObjectId;
  name: string;
  nameInDzongkha?: string;
  dzongkhag: Types.ObjectId | IDzongkhag
  area?: number;
  population?: number;
  coordinates?: CoordinatesType
}


export type IConsumer = {
  _id?: Types.ObjectId; // optional if not yet stored
  householdId: string;
  householdHead: {
    name?: string;
    cid?: string;
    phone?: string;
  };
  address: {
    dzongkhag: Types.ObjectId;
    gewog: Types.ObjectId;
    village?: string;
    houseNumber?: string;
  };
  familySize?: number;
  connectionType: ConnectionType;
  meterNumber?: string;
  connectionDate?: Date;
  status?: ConsumerStatus;
  tariffCategory?: TariffCategory;
}






