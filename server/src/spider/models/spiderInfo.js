import mongooes from 'mongoose'
import SpiderInfoSchema from '../schemas/spiderInfo'

const SpiderInfo = mongooes.model('spiderinfo', SpiderInfoSchema);

export default SpiderInfo;