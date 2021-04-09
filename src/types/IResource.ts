import { Document } from "mongoose";

export interface IResource extends Document {
    am_id: string,
    am_name: string
}