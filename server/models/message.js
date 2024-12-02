import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
    senderId: {type:Schema.Types.ObjectId,ref:"User"},
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;
