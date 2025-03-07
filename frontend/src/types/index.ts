import { z } from 'zod'

/** Task */



export const tasktSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: z.enum(["pending", "onHold", "inProgress", "underReview", "completed"])
})

export type Task = z.infer<typeof tasktSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>

/** Project */
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true
    })
)

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'projectName' | 'clientName' | 'description'>