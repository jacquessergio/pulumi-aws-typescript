import { model, Schema } from 'mongoose';
import { IResource } from '../types/IResource';

const resourceSchema = new Schema({
    am_id: {
        type: String,
        required: true
    },
    am_name: {
        type: String,
        required: true
    }
})

export default model<IResource>('Resource', resourceSchema)
