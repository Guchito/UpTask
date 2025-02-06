import { Link } from "react-router-dom"
import {useForm} from 'react-hook-form'
import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types"
function CreateProjectViews() {
    const initialValues : ProjectFormData = {
        projectName : "",
        clientName: "",
        description : ""
    }
    const {register, handleSubmit, formState:{errors}} = useForm({defaultValues: initialValues})
    
    const handleForm = (data : ProjectFormData) => {
        console.log(data)
    }
    return (
    <>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-black">Create project</h1>
            <nav className='my-5'>
            <Link
                className='bg-purple-400 hover:bg-[#c026d3] px-10 py-3 font-bold text-white text-xl cursor-pointer transition-colors'
                to='/'
            
            >Return to all projects</Link>

            </nav>
            
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
                    value="Create project"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase cursor-pointer transition-colors font-bold"
                />
            </form>
        </div>
    </>
  )
}

export default CreateProjectViews