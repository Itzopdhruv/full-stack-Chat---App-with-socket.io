import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
    },
    photo : {
        type : String,
        default : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
    }
}, { timestamps: true }); // createdAt & updatedAt

const User = mongoose.model("User", userSchema);
export default User;