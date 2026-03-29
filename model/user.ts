import mongoose , {Schema,Document,Model} from "mongoose";

export interface IUser extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: 'Admin' | 'Manager' | 'Employee';
  managerId: mongoose.Types.ObjectId | null;
  isManagerApprover: boolean;
}

const userSchema : Schema<IUser> = new Schema({
    companyId:{
        type:Schema.Types.ObjectId,
        ref:'Company',
        required:true
    },
    name:{
        type :String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    passwordHash:{
        type:String,
        required:true
    },
     role: { 
    type: String, 
    enum: ['Admin', 'Manager', 'Employee'], 
    required: true 
  },

  managerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
},
  isManagerApprover: { 
    type: Boolean, 
    default: false,
}

})

const User:Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User",userSchema);

export default User;