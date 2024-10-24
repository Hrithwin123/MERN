const express = require("express")
const router = express.Router()
const path = require("path")


router.get(["/","/index", "/index.html"], (req, res) => {

    res.sendFile(path.join(__dirname,"..", "views", "index.html"))

})


router.all("*", (req, res) => {    //404 Page
    
    res.status(404)
    
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname, "..",  "views", "404.html"))
        
    }
    else if(req.accepts("json")){
        res.json({message : "404 Not found"})
    }
    else{
        res.type("txt").send("404 Not Found")
    }

})



module.exports = router