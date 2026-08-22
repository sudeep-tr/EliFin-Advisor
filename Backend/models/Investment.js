const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},

name: {
  type: String,
  required: true,
  trim: true,
},

type: {
  type: String,
  default: "SIP",
  trim: true,
},

category: {
  type: String,
  default: "Mutual Fund",
  trim: true,
},

monthlyAmount: {
  type: Number,
  default: 0,
  min: 0,
},

investedAmount: {
  type: Number,
  default: 0,
  min: 0,
},

currentValue: {
  type: Number,
  default: 0,
  min: 0,
},

frequency: {
  type: String,
  default: "monthly",
  trim: true,
},

startDate: {
  type: Date,
},

notes: {
  type: String,
  default: "",
  trim: true,
},


},
{
timestamps: true,
}
);

module.exports = mongoose.model(
"Investment",
investmentSchema
);
