import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { toast } from "react-toastify";
import { forgotPassword } from "@/api/AuthAPI";

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: ''
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });
  
  
    const {mutate} = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
      }
    })
    const handleForgotPassword = (formData: ForgotPasswordForm) => {mutate(formData)}

  return (
    <>

        <h1 className="text-5xl font-black text-white">Reset Password</h1>
        <p className="text-2xl font-light text-white mt-5">
            Enter your email to{''}
            <span className=" text-fuchsia-500 font-bold"> reset your password</span>
        </p>
      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className="space-y-8 p-10 mt-5 bg-white"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
            htmlFor="email"
          >Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your Email"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Recover password'
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
      <Link
          to='/auth/new-password'
          className="text-center text-gray-300 font-normal"
        >
          Enter token
        </Link>
        <Link
          to='/auth/signup'
          className="text-center text-gray-300 font-normal"
        >
          Don't have an account? Register
        </Link>
      </nav>
    </>
  )
}