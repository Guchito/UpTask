import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"

type EditProjectFormProps = {
    data: ProjectFormData
}


function EditProjectForm({data} : EditProjectFormProps) { 
    const {register, handleSubmit, formState:{errors}} = useForm({defaultValues: {
        projectName : data.projectName,
        clientName: data.clientName,
        description : data.description
    }})

    const handleForm = ( formData : ProjectFormData) => {
        console.log(formData)
    }
        
return (
    <>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-black">Edit project</h1>
            
            <form
                className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >
                <ProjectForm 
                    register={register}
                    errors={errors}
                />
                <input
                    type="submit"
                    value="Save changes"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase cursor-pointer transition-colors font-bold"
                />
            </form>
            <nav className='my-10'>
            <Link
                className='bg-purple-400 hover:bg-[#c026d3] px-10 py-3 font-bold text-white text-xl cursor-pointer transition-colors'
                to='/'
            
            >Return to all projects</Link>

            </nav>
        </div>
    </>
    )
}


export default EditProjectForm