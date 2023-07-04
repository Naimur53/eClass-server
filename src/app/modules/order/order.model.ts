import { Schema, model } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const orderSchema = new Schema<IOrder>({
  cow: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Cow',
  },
  buyer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export const Order = model<IOrder, OrderModel>('Order', orderSchema);
