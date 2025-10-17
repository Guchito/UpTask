import mongoose, { Schema , Document, PopulatedDoc, Types} from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";

export interface IProject extends Document {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[]; // This is an array of tasks
    manager: PopulatedDoc<IUser & Document>;
    team: PopulatedDoc<IUser & Document>[]; // This is an array of users.
}

export const ProjectSchema: Schema = new Schema({
    projectName: { 
        type: String,
        required: true,
        trim: true,       
    },
    clientName: { 
        type: String,
        required: true,
        trim: true,       
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    tasks:[
        {
            type: Types.ObjectId,
            ref: "Task", //Name of the collection in the database
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: "User",
    },
    team:[
        {
            type: Types.ObjectId,
            ref: "User", //Name of the collection in the database
        }
    ],
 },{ timestamps: true });

const Project = mongoose.model<IProject>('Project', ProjectSchema); // Project is the name of the collection in the database

export default Project