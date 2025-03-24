import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string;
    name: string;
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async ( user : IEmail ) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask>',
            to: user.email,
            subject: 'UpTask - Please confirm your account',
            text: 'UpTask - Please confirm your account',
            html: `<p>Hi ${user.name}, you have created an account in UpTask</p>
                <p> Click here to <a href="${process.env.FRONTEND_URL}/auth/confirm-account">confirm your account</a> </p>
                <p> using the following code: <b>${user.token}</b></p>
                <p> This code will expire in 10 minutes</p>
            
            `
        })
        console.log('message sent: %s', info.messageId);
    }
    static ResetPasswordEmail = async ( user : IEmail ) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask>',
            to: user.email,
            subject: 'UpTask - Reset your password',
            text: 'UpTask - Reset your password',
            html: `<p>Hi ${user.name}, you have solicited to reset your password</p>
                <p> Click here to <a href="${process.env.FRONTEND_URL}/auth/new-password">reset your password</a> </p>
                <p> using the following code: <b>${user.token}</b></p>
                <p> This code will expire in 10 minutes</p>
            
            `
        })
        console.log('message sent: %s', info.messageId);
    }
}


 
