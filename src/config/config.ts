import {diskStorage} from 'multer'
import path from 'path'
import crypto from 'crypto'

export default  {
    storage : diskStorage({
        destination : path.resolve(__dirname, "..", "..", "tmp"),
        filename: (req, file, callback)=>{
            let fileHash = crypto.randomBytes(4).toString('hex')
            callback(null, `${fileHash}-${file.originalname}`)
        }
    })
}