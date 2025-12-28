import mongoose, { Schema } from "mongoose";

interface UserDocumentInterface  {
    email:string,
    password:string    
}

const UserSchema :Schema<UserDocumentInterface> = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

const User  = mongoose.models.User || mongoose.model<UserDocumentInterface>("User", UserSchema)

export default User;