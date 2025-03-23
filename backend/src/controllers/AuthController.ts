import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";



export class AuthController{
    static createAccount = async (req: Request, res: Response) =>{
        try{
            const { password , email } = req.body
            // check if user exists
            const userExists = await User.findOne({email})
            if (userExists){
                const error = new Error("User already exists");
                res.status(409).json({error: error.message});
            }
            
            // create user
            const user = new User(req.body);
            // hash password
            user.password = await hashPassword(password)
            
            //Generate Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            
            await Promise.allSettled([user.save(), token.save()])
            
            
            res.send("Account created successfully. Please check your email to confirm your account");
        }catch(error){
            res.status(500).json({error: "there was an error creating the account"});
        }
    }

    static confirmAccount = async (req: Request, res: Response) =>{
        try{
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if( !tokenExists){
                const error = new Error("Invalid token");
                res.status(404).json({error: error.message});
            }else{
                const user = await User.findById(tokenExists.user)
                user.confirmed = true
                await Promise.allSettled([
                    user.save(),
                    tokenExists.deleteOne()
                ])
                res.send("Account confirmed successfully");
            }
        }catch(error){
            res.status(500).json({error: "there was an error creating the account"});
        }
    }

    static login = async (req: Request, res: Response) =>{
        try{
            const { email , password } = req.body
            const user = await User.findOne({email})
            if(!user){
                const error = new Error("User not found");
                res.status(404).json({error: error.message});
            }
            if(!user.confirmed){
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                 //send email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error("User not confirmed. A new confirmation email has been sent to your email");
                res.status(401).json({error: error.message});
            }

            //Check password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error("Invalid password");
                res.status(401).json({error: error.message});
            }

            res.send("Login successful");

        }catch(error){
            res.status(500).json({error: "there was an error creating the account"});
        }
    }
}