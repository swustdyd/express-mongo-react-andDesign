/**
 * Created by Aaron on 2017/12/15.
 */
import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    icon: {
        displayName: String,
        src: String
    },
    /*
    * normal user 0
    * admin  user (10,50]
    * super admin  (50,
    */
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt:{
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
export default UserSchema;