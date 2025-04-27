import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateStatus } from '@/api/TaskAPI';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/utils';
import { statusTranslations } from '@/locales/en';
import { TaskStatus } from '@/types';
import NotesPanel from '../notes/NotesPanel';


export default function TaskModalDetails() {

    const params = useParams()
    const projectId = params.projectId!
    const navigate = useNavigate()
    const location = useLocation()
    const queryparams = new URLSearchParams(location.search)
    const taskId = queryparams.get('viewTask')!
    
    const show = taskId ? true : false

    const { data, isError, error } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId,
        retry: false
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateStatus, 
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['project', projectId]}) // Invalidate the project query to refetch the tasks
            queryClient.invalidateQueries({queryKey: ['task', taskId]}) // Invalidate the task query to refetch the status
            navigate(location.pathname, {replace: true})
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        const status = e.target.value as TaskStatus

        const data = { projectId, taskId, status }
        mutate(data)
    }

    if(isError){
        toast.error(error.message, {toastId: 'taskError'})
        return <Navigate to={`/projects/${projectId}`} />
    }

    if(data) return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <p className='text-sm text-slate-400'>Created at: {formatDate(data.createdAt)} </p>
                                    <p className='text-sm text-slate-400'>Last updated: {formatDate(data.updatedAt)}</p>
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl text-slate-600 my-5"
                                    >{data.name}</Dialog.Title>
                                    <p className="text-lg text-slate-500 mb-2">{data.description}</p>
                                    
                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Status:</label>
                                        <select
                                            className='w-full p-3 bg-white border border-grey-300'
                                            defaultValue={data.status}
                                            onChange={handleChange}
                                        >
                                            {Object.entries(statusTranslations).map(([key, value]) => (
                                                <option key={key} value={key}> {value} </option>
                                            ))}
                                        </select>
                                    </div>

                                    {data.completedBy.length ? (
                                        <>
                                            <div className="space-y-4">
                                                <p className="font-bold text-2xl text-slate-600 my-5">
                                                    Status Log
                                                </p>
                                            
                                                <ul className="relative border-l-2 border-slate-300">
                                                    {data.completedBy.map((activityLog: any, index: number) => (
                                                        <li key={activityLog._id} className="mb-6 ml-6">
                                                            <div className="absolute -left-3 w-6 h-6 bg-slate-500 rounded-full border-4 border-white flex items-center justify-center">
                                                                <span className="text-xs text-white">
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm">
                                                                <span className="font-bold text-slate-600">
                                                                    {statusTranslations[activityLog.status]}
                                                                </span>{" "}
                                                                <span className="text-slate-500">By:</span>{" "}
                                                                <span className="text-slate-700">
                                                                    {activityLog.user.name}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </>
                                    ): null}
                                    <NotesPanel
                                        notes={data.notes}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}