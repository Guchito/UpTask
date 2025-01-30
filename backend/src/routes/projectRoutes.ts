import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { validateProjectExists } from '../middleware/project';


const router = Router();


router.post('/', 
    body('projectName')
        .notEmpty().withMessage('Project name is required'),
    body('clientName')
        .notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.createProject
);
router.get('/', ProjectController.getAllProjects);

router.get('/:id', 
    param('id')
        .isMongoId().withMessage('Invalid project id'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.put('/:id', 
    param('id')
        .isMongoId().withMessage('Invalid project id'),
    body('projectName')
        .notEmpty().withMessage('Project name is required'),
    body('clientName')
        .notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.updateProject
);


router.delete('/:id', 
    param('id')
        .isMongoId().withMessage('Invalid project id'),
    handleInputErrors,
    ProjectController.deleteProject
);

//Routes for tasks

router.param('projectId',validateProjectExists) //This middleware will check if the project exists before continuing with the request, every time the parameter projectId is present in the URL.

router.post('/:projectId/tasks',
    body('name')
        .notEmpty().withMessage('Task name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks

)

router.get('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('Invalid task id'),
    handleInputErrors,
    TaskController.getTaskById

)

router.put('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('Invalid task id'),
    body('name')
        .notEmpty().withMessage('Task name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.updateTask

)

router.delete('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('Invalid project id'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId')
        .isMongoId().withMessage('Invalid project id'),
    body('status')
        .notEmpty().withMessage('Status is required'),
    handleInputErrors,
    TaskController.updateStatus
)
export default router;