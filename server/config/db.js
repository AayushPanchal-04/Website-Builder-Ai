import mongoose from "mongoose"
import dns from "dns"

dns.setServers(["8.8.8.8","1.1.1.1"])

// Serverless platforms can spin up many instances and reuse the same process
// between requests, so the connection is cached on the global object instead
// of being opened again on every invocation.
let cached = globalThis.__mongoose
if (!cached) {
    cached = globalThis.__mongoose = { conn: null, promise: null }
}

const connectDb=async ()=>{
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URL)
    }

    try {
        cached.conn = await cached.promise
        console.log("db connected")
    } catch (error) {
        cached.promise = null
        console.log("db error:", error.message)
    }

    return cached.conn
}

export default connectDb
