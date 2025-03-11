import {CorsOptions} from 'cors'

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whitelist = [process.env.FRONTEND_URL];
        if(process.argv[2] === '--api'){
            whitelist.push(undefined)
        }
        if(whitelist.includes(origin)) {
            callback(null, true)
        }else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
}