import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose,{Schema} from "mongoose";
const commentSchema= new Schema(
    {
        content: {
            type: String,
            required: [true,"Content is required"]
        },
        bookId: {
            type: Schema.Types.ObjectId,
            ref: "Books"
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps:true
    }
)
commentSchema.plugin(mongooseAggregatePaginate);
export const Comments = mongoose.model("Comments",commentSchema);