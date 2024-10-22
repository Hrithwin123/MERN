const express = require("express")

const app = express()

const path = require("path")

const port = process.env.PORT || 3500

const {logger} = require("./middleware/logger")



app.use(logger)


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

//MIDDLE WARES
app.use("/", express.static(path.join(__dirname, "public"))) //middleware for public files

app.use(express.json()) //middleware to process json files 



app.use("/", require("./routes/root"))



app.all("*", (req, res) => {

    res.status(404)


    if(req.accepts("html")){
        res.sendFile(path.join(__dirname, "views", "404.html"))

    }
    else if(req.accepts("json")){
        res.json({message : "404 Not found"})
    }
    else{
        res.type("txt").send("404 Not Found")
    }
})