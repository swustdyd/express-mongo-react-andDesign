import mongooes from 'mongoose'
import ProxySchema from '../schemas/proxy'

const Proxy = mongooes.model('Proxy', ProxySchema);

export default Proxy;