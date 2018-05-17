import mongooes from 'mongoose'
import SpiderInfoSchema from '../schemas/spiderInfo'

const SpiderInfo = mongooes.model('SpiderInfo', SpiderInfoSchema);

export default SpiderInfo;