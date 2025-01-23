import type { Request, Response } from 'express';
import Task  from '../models/Task';



export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            await Promise.allSettled([task.save(), req.project.save()]) //I saved them at the same time. If one fails, the other will not be saved.
            res.send('task created');
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try{
            const tasks = await Task.find({project: req.project.id}).populate('project');
            res.json(tasks);
        }catch(error){
            res.status(500).json({error: error.message});
        }
    }
}