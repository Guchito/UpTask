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

    static getTaskById = async (req: Request, res: Response): Promise<void> =>  {
        try {
            const {taskId} = req.params
            const task = await Task.findById(taskId)
            if(!task){
                const error = new Error('Task not found');
                res.status(404).json({error: error.message});
                return;
            }
            if(task.project.toString() !== req.project.id){
                const error = new Error('Task not found in this project');
                res.status(400).json({error: error.message});
                return;
            }
            res.json(task);
        }catch(error){
            res.status(500).json({error: error.message});
        }
    }

    static updateTask = async (req: Request, res: Response): Promise<void> =>  {
        try {
            const {taskId} = req.params
            const task = await Task.findById(taskId)
            if(!task){
                const error = new Error('Task not found');
                res.status(404).json({error: error.message});
                return;
            }
            if(task.project.toString() !== req.project.id){
                const error = new Error('Task not found in this project');
                res.status(400).json({error: error.message});
                return;
            }
            task.name = req.body.name || task.name;
            task.description = req.body.description || task.description;
            await task.save();
            res.send("task updated");
        }catch(error){
            res.status(500).json({error: error.message});
        }
    }


    static deleteTask = async (req: Request, res: Response): Promise<void> =>  {
        try {
            const {taskId} = req.params
            const task = await Task.findById(taskId)
            if(!task){
                const error = new Error('Task not found');
                res.status(404).json({error: error.message});
                return;
            }
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== taskId);

            await Promise.allSettled([task.deleteOne(), req.project.save()])

            res.send("task deleted");
        }catch(error){
            res.status(500).json({error: error.message});
        }
    }
    
    static updateStatus = async (req: Request, res: Response): Promise<void> =>  {
        try {
            const { taskId } = req.params
            const task = await Task.findById(taskId)
            if(!task){
                const error = new Error('Task not found');
                res.status(404).json({error: error.message});
                return;
            }
            const { status } = req.body
            task.status = status;
            await task.save();
            res.send("task updated");
        }catch(error){
                res.status(500).json({error: error.message});
        }
    }

}