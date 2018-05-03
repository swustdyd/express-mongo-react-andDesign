/**
 * Created by Aaron on 2017/12/15.
 */
import mongooes from 'mongoose'
import UserSchema from '../schemas/user'

const User = mongooes.model('User', UserSchema);

export default User;