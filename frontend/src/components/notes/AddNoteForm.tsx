import { NoteFormData } from '@/types'
import { useForm } from 'react-hook-form'
import ErrorMessage from '../ErrorMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '@/api/NoteAPI'
import { toast } from 'react-toastify'
import { useLocation, useParams } from 'react-router-dom'

export default function AddNoteForm() {
    const params = useParams()
    const location = useLocation()

    const queryparams = new URLSearchParams(location.search)
    const taskId = queryparams.get('viewTask')!
    const projectId = params.projectId!
    

    const initiaulValues : NoteFormData = {
        content: ''
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: initiaulValues
    })
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })
    const handleAddNote = (formData : NoteFormData) => {
        mutate({projectId, taskId, formData})
        reset()
    }
  return (
    <form
        onSubmit={handleSubmit(handleAddNote)}
        className="space-y-3"
        noValidate
    >
    <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="content">
            Add a note
        </label>
        <input 
            id="content"
            type="text"
            placeholder="Enter your note here..."
            className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            {...register('content', {
                required: 'This field is required',
            })}

         />
         {errors.content && (
            <ErrorMessage>{errors.content.message}</ErrorMessage>
         )}
    </div>
    <input
        type="submit"
        value="Add Note"
        className="bg-fuchsia-600 text-white font-black  w-full p-3 hover:bg-fuchsia-700 transition duration-200"
    />

    </form>
  )
}
