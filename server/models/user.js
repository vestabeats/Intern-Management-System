import bcrypt from "bcryptjs"
import mongoose,{Schema}  from "mongoose"

const userSchema = new Schema({
    surname:{type:String,required:true},
    firstname:{type:String,required:true},
    dob:{type:Date,default:new Date()},
    startdate:{type:Date,default:new Date()},
    department:{type:String,required:true},
    role:{type:String,required:true},
    enddate:{type:Date,default:new Date()},
    phonenumber:{type:String,required:false},
    theme:{type:String,required:false},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isAdmin:{type:Boolean,required:true,default:false},
    isSup:{type:Boolean,required:true,default:false},
    supervisor:{type:Schema.Types.ObjectId,ref:"User"},
    tasks:[{type:Schema.Types.ObjectId,ref:"Task"}],
    isActive:{type:Boolean,required:true,default:true},
    isTrashed:{type:Boolean,default:false}
},
{timestamps:true}
);

userSchema.pre("save", async function(next){
     
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
const User = mongoose.model("User",userSchema);
export default User;