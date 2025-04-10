import type { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body;
        // find the user in the database
        const user = await User.findOne({ email }).select('id name email');
        if(!user) {
            const error = new Error('User not found');
            res.status(404).json({ error: error.message });
            return
        }
        res.json(user)
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await (await Project.findById(req.project.id)).populate({
            path: 'team',
            select: 'id name email'
        })
        res.json(project.team);
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body;
        // find the user in the database
        const user = await User.findById(id).select('id');

        if(!user) {
            const error = new Error('User not found');
            res.status(404).json({ error: error.message });
            return
        }

        //Check if the user is already in the project
        if(req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('User already in the project');
            res.status(409).json({ error: error.message });
            return
        }
        //Add to project
        req.project.team.push(user.id);
        await req.project.save();
        res.send('User added to project');
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params;
        //Check if the user is in the project
        if(!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('User not in the project');
            res.status(409).json({ error: error.message });
            return
        }
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);
    
        await req.project.save();
        res.send('User deleted from project');

    }
} 