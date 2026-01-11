import mongoose from "mongoose";
const { Schema } = mongoose;

const StocksSchema = new Schema({
  symbol: { type: String, required: true, index: true }, // index for faster searching
  report_date: { type: Date, required: true },
  open: { type: Number, required: true },
  close: { type: Number, required: true }, // This will serve as "Current Price"
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  volume: { type: Number, required: true },
  market_cap: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const StocksModel = mongoose.model("Stocks", StocksSchema);
export default StocksModel;