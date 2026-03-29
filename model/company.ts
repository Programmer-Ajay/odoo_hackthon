import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  baseCurrency: string;
  country:string;
  createdAt: Date;
}

const companySchema: Schema<ICompany> = new Schema({
  name: { type: String, required: true },
  baseCurrency: { type: String, required: true },
  country:{ type:String,required:true},
  createdAt: { type: Date, default: Date.now }
});
 // this is for hot reloadinng
// The Next.js hot-reload fix, typed correctly
const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema);

export default Company; 