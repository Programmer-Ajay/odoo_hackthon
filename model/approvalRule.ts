import mongoose ,{Schema,Document,Model} from "mongoose";

export interface IApprovalRule extends Document{
    companyId:mongoose.Types.ObjectId;
    ruleName:string;
    ruleType: 'Sequential' | 'Percentage' | 'SpecificApprover' | 'Hybrid';

    percentageThreshold?:number | null;
    specificApproverId?: mongoose.Types.ObjectId | null;
    assignedApprovers: mongoose.Types.ObjectId[];
}

const approvalRuleSchema : Schema<IApprovalRule>= new Schema({
    companyId:{
        type:Schema.Types.ObjectId,
        ref:'Company',
        required:true,
    },
    ruleType:{
      type:String,
      enum: ['Sequential', 'Percentage', 'SpecificApprover', 'Hybrid'], 
       required: true,

    },
    percentageThreshold: {
         type: Number, 
         default: null
         },
  specificApproverId: { 
    type: Schema.Types.ObjectId,
     ref: 'User', 
     default: null
     },
  assignedApprovers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
}]
});

const ApprovalRule:Model<IApprovalRule>=mongoose.models.ApprovalRule || mongoose.model<IApprovalRule>("ApprovalRule",approvalRuleSchema);

export default ApprovalRule;