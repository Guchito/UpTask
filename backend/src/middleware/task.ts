import type { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/Task';

declare global {
    namespace Express {
        interface Request {
            task: ITask;
        }
    }
}

export async function taskExists( req : Request , res : Response , next : NextFunction ) {
    try{
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if(!task) {
            const error = new Error('Task not found');
            res.status(404).json({ error: error.message });
            return;
        }
        req.task = task;
        next();
    }catch(error){
        if (error.name === 'CastError' || error.message.includes('not found')) {
            res.status(404).json({ error: 'Task not found' });
          } else {
            res.status(500).json({ error: 'There was an error' });
          }
        }
}

export function taskBelongsToProject( req : Request , res : Response , next : NextFunction ) {
    if(req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Task not found in this project');
        res.status(400).json({error: error.message});
        return;
    }
    next();
}