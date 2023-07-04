import { Schema, model } from 'mongoose';
import { CowModel, ICow } from './cow.interface';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

const cowSchema = new Schema<ICow>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  price: { type: Number, required: true },
  location: {
    type: String,
    enum: [
      'Dhaka',
      'Chattogram',
      'Barishal',
      'Rajshahi',
      'Sylhet',
      'Comilla',
      'Rangpur',
      'Mymensingh',
    ],
    required: true,
  },
  breed: {
    type: String,
    enum: [
      'Brahman',
      'Nellore',
      'Sahiwal',
      'Gir',
      'Indigenous',
      'Tharparkar',
      'Kankrej',
    ],
    required: true,
  },
  weight: { type: Number, required: true },
  label: {
    type: String,
    enum: ['for sale', 'sold out'],
    required: true,
  },
  category: {
    type: String,
    enum: ['Dairy', 'Beef', 'Dual Purpose'],
    required: true,
  },
  seller: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

cowSchema.pre('save', async function (next) {
  const isExist = await User.findOne({
    _id: this.seller,
    role: 'seller',
  });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Seller not found');
  }
  next();
});
export const Cow = model<ICow, CowModel>('Cow', cowSchema);
