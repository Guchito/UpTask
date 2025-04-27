import mongoose, { Schema , Document, Types} from "mongoose";


const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
}as const;


export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]; // Created my own types for taskStatus

export interface ITask extends Document {
    name: string;
    description: string;
    project: Types.ObjectId;
    status: TaskStatus;
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[]
    notes: Types.ObjectId[]
}

export const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    project: {
        type: Types.ObjectId,
        ref: "Project", //Name of the collection in the database
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    completedBy:[
        {
            user: {
                type: Types.ObjectId,
                ref: "User", //Name of the collection in the database
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [{
        type: Types.ObjectId,
        ref: "Note", //Name of the collection in the database
    }]
},{ timestamps: true });


const Task = mongoose.model<ITask>("Task", TaskSchema); // Task is the name of the collection in the database

export default Task;