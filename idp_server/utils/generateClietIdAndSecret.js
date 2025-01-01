import shortid from "shortid"
import { v4 } from "uuid"

export const generateClientId = async()=>{
    const id = shortid.generate()
    return id
}

export const generateClientSecret = async()=>{
    const secret = v4()
    return secret
}