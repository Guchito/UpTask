import mongoose, { Schema , Document} from "mongoose";

export type ProjectType = Document & {
    projectName: string;
    clientName: string;
    description: string;
}

const ProjectSchema: Schema = new Schema({
    proyectName: { 
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
    }
 });

 const Project = mongoose.model<ProjectType>('Project', ProjectSchema); // Project is the name of the collection in the database