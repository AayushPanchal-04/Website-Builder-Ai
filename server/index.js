import dotenv from "dotenv"
dotenv.config()
import app from "./app.js"
import connectDb from "./config/db.js"

const port=process.env.PORT || 5000

app.listen(port,()=>{
    console.log("server started")
    connectDb()
})
