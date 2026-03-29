import mongoose, { Schema, Document, Model } from 'mongoose';

// Sub-document interface for the history array
export interface IApprovalHistory {
  approverId: mongoose.Types.ObjectId;
  action: 'Approved' | 'Rejected' | 'Pending';
  comments?: string;
  actionDate?: Date;
}

// Sub-document interface for expense lines (from OCR)
export interface IExpenseLine {
  description: string;
  amount: number;
}

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  amountSubmitted: number;
  currencySubmitted: string;
  amountInBaseCurrency?: number;
  category?: string;
  description?: string;
  expenseDate?: Date;
  receiptImageUrl?: string;
  vendorName?: string;
  expenseLines: IExpenseLine[];
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedRuleId?: mongoose.Types.ObjectId;
  approvalHistory: IApprovalHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema: Schema<IExpense> = new Schema({
  userId: 
  { type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
 },
  companyId: { 
    type: Schema.Types.ObjectId,
     ref: 'Company',
      required: true 
    },
  
  amountSubmitted: { 
    type: Number, 
    required: true
 }, 
  currencySubmitted: {
     type: String,
      required: true
     },
  amountInBaseCurrency: { 
    type: Number
 }, 
  category: { 
    type: String
   },
  description: { 
    type: String 
},
  expenseDate: { 
  type: Date },
  
  receiptImageUrl: { 
    type: String 
},
  vendorName: { 
    type: String 
},
  expenseLines: [{ 
    description: String, 
    amount: Number 
  }],
  
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  appliedRuleId: { 
    type: Schema.Types.ObjectId, 
    ref: 'ApprovalRule' 
},
  
  approvalHistory: [{
    approverId: { 
        type: Schema.Types.ObjectId,
         ref: 'User' 
        },
    action: { 
        type: String,
         enum: ['Approved', 'Rejected', 'Pending'] 
        },
    comments: { type: String },
    actionDate: { type: Date }
  }]
}, { timestamps: true });

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', expenseSchema);

export default Expense;
