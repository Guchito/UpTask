import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useState } from "react";
import { ConfirmToken } from "@/types";


export default function NewPasswordView() {

  const [token, setToken] = useState<ConfirmToken['token']>('');

  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <>
      <h1 className="text-5xl font-black text-white">Reset Password</h1>
      <p className="text-2xl font-light text-white mt-5">
        Enter the token you received{''}
        <span className=" text-fuchsia-500 font-bold"> on your email </span>
      </p>
      {!isValidToken ? 
        <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} /> : 
        <NewPasswordForm token={token}/>
      }
    </> 
  )
}
