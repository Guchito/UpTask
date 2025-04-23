import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { projectExists } from '../middleware/project';
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task';
import { authenticate } from '../middleware/auth';
import { TeamMemberController } from '../controllers/TeamController';


const router = Router();

router.use(authenticate)

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
router.get('/',ProjectController.getAllProjects);

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

router.param('projectId',projectExists) //This middleware will check if the project exists before continuing with the request, every time the parameter projectId is present in the URL.

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

router.param('taskId',taskExists) //This middleware will check if the task exists before continuing with the request, every time the parameter taskId is present in the URL.
router.param('taskId', taskBelongsToProject) //This middleware will check if the task belongs to the project before continuing with the request, every time the parameter taskId is present in the URL.

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
    hasAuthorization,
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

/** Routes for teams */
router.post('/:projectId/team/find', 
    body('email')
        .isEmail().toLowerCase().withMessage('Email is invalid'),
    handleInputErrors,   
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team', 
    handleInputErrors,   
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team', 
    body('id')
        .isMongoId().withMessage('Id is invalid'),
    handleInputErrors,   
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId', 
    param('userId')
        .isMongoId().withMessage('Id is invalid'),
    handleInputErrors,   
    TeamMemberController.removeMemberById
)

export default router;