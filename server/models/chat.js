import mongoose,{Schema} from "mongoose";

const ChatSchema = new Schema(
  {
    members:[{type:Schema.Types.ObjectId,ref:"User"}],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;