const express = require("express")

const path = require("path")

const port = process.env.PORT || 3500

const cookieParser = require("cookie-parser")

const cors = require("cors")

const corsOptions = require(path.join(__dirname, "config", "corsOptions.js"))

const {logger} = require("./middleware/logger")

const {errorHandler} = require("./middleware/errorHandler")

const { error } = require("console")



const app = express() //creating an app

//MIDDLE WARES

app.use(logger) //userdefined middleware made for each person logging to our website


app.use("/", express.static(path.join(__dirname, "public"))) //middleware for public files

app.use(express.json()) //middleware to process json files 

app.use(cookieParser())//middleware to parse cookies

app.use(cors(corsOptions)) //Cross origin Resource Sharing (CORS)



app.use("/", require(path.join(__dirname, "routes", "root.js"))) //calling the Routes from its folder


app.get("/error", (req, res, next) => {
    const err =  new Error("This is a text error")
    next(err)
    
})

app.use(errorHandler) //errorHandler user defined


// app.all("*", (req, res) => {    //404 Page
    
//     res.status(404)
    
    
//     if(req.accepts("html")){
//         res.sendFile(path.join(__dirname, "views", "404.html"))
        
//     }
//     else if(req.accepts("json")){
//         res.json({message : "404 Not found"})
//     }
//     else{
//         res.type("txt").send("404 Not Found")
//     }
// })




app.listen(port, () => {
    console.log(`Server running on port ${port}`) //server Listening
})