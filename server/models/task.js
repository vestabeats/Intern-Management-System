import mongoose,{Schema}  from "mongoose"

const taskSchema  = new Schema({
    title:{type:String,required:true},
    date:{type:Date, default:new Date()},
    priority:{
        type:String,
        default:"normal",
        enum:["high","medium","normal","low"]
    },
    stage:{
        type:String,
        default:"todo",
        enum:["todo","in progress","completed"]
    },
    evaluation:{
        performance:{
            type:String,
        default:"",
        enum:[
            "very bad",
            "bad",
            "fair",
            "good",
            "very good",
            "excellent",
            "pending"
    ]
        },
        mark:String,
        date:{type:Date, default:new Date()},
        by:{type:Schema.Types.ObjectId,ref:"User"}
    },
    subTask:[{title:String,tag:String,assets:[String],by:{type:Schema.Types.ObjectId,ref:"User"},submitedAt:{type:Date, default:new Date()}}],
    assets:[String],
    team:[{type:Schema.Types.ObjectId,ref:"User"}]
    
},{timestamps:true});

const Task = mongoose.model("Task",taskSchema);
export default Task