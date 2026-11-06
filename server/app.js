import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import websiteRouter from "./routes/website.routes.js"
import billingRouter from "./routes/billing.routes.js"
import { stripeWebhook } from "./controllers/stripeWebhook.controller.js"

const app=express()

// Stripe verifies the raw request body, so this route must be registered
// before express.json() gets a chance to parse it.
app.post("/api/stripe/webhook",express.raw({type:"application/json"}),stripeWebhook)

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:(origin,callback)=>{
        const allowed=[process.env.FRONTEND_URL,"http://localhost:5173"].filter(Boolean)
        callback(null,!origin || allowed.includes(origin))
    },
    credentials:true
}))

// Make sure MongoDB is connected (and reused) before any API route runs.
app.use(async (req,res,next)=>{
    await connectDb()
    next()
})

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/website",websiteRouter)
app.use("/api/billing",billingRouter)

export default app
