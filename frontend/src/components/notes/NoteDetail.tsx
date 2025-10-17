import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import { Note } from "@/types"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"


type NoteDetailProps = {
    note: Note
}
export default function NoteDetail({note} : NoteDetailProps) {
    const {data, isLoading} = useAuth()
    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])
    const params = useParams()
    const location = useLocation()
    const queryparams = new URLSearchParams(location.search)
   
    const projectId = params.projectId!
    const taskId = queryparams.get('viewTask')!

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            
        }
    })


    if(isLoading) return <p>Loading...</p>
  return (
    <div className="p-3 flex justify-between items-center">
        <div>
            <p>
                {note.content} - By: <span className="font-bold">{note.createdBy.name}</span>
            </p>
            <p className="text-xs text-slate-400">
                {formatDate(note.createdAt)}
            </p>

        </div>
        {canDelete && (
            <button
                type="button"
                className="bg-red-500 text-white text-xs p-2 hover:bg-red-700 transition-colors duration-200"
                onClick={() => mutate({projectId, taskId, noteId: note._id})}
            > Delete</button>
        )}
    </div>
  )
}
