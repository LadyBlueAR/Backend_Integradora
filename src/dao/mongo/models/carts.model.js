import mongoose from "mongoose";

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
      type: [{
        quantity: { type: Number, default: 1 },
      }],
      default: [],
    },
  });
  
export const cartModel = mongoose.model(cartCollection, cartSchema);
