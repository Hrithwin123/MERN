require("dotenv").config()

const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require(path.join(__dirname, "config", "corsOptions.js"))
const {logger, logEvents} = require("./middleware/logger")
const {errorHandler} = require("./middleware/errorHandler")
const mongoose = require("mongoose")
const connectDB = require("./config/dbConn")


const port = process.env.PORT || 3500 //port number


const app = express() //creating an app


//MIDDLE WARES

app.use(logger) //userdefined middleware made for each person logging to our website


app.use(express.static(path.join(__dirname, "public"))) //middleware for public files

app.use(express.json()) //middleware to process json files 

app.use(cookieParser())//middleware to parse cookies

app.use(cors(corsOptions)) //Cross origin Resource Sharing (CORS)



app.use("/", require(path.join(__dirname, "routes", "root.js"))) //calling the Routes from its folder

app.use("/users", require(path.join(__dirname, "routes", "userRoutes.js")))


app.use(errorHandler) //errorHandler user defined


connectDB()

mongoose.connection.once("open", () => {   //once mongoDB has opened (connection made) then => {
    
    
    console.log("Connected to MongoDB")

    app.listen(port, () => {
        console.log(`Server running on port ${port}`) //server Listening
    })

})



mongoose.connection.on("error", (err) => {

    console.log(err)

    const message = `${err.no}: ${err.code} \t ${err.syscall}\t${err.hostname}`

    logEvents(message,"mongoErrLog.log" )

})