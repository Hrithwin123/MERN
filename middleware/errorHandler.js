const path = require("path")
const {logEvents, logger} = require(path.join(__dirname,"logger.js"))



const errorHandler = async (err, req, res, next) => {

    console.log("Errorhandler Activated")

    await logEvents(`${err.name} : ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errLog.log")

    console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500 //server error

    res.status(status)

    
    await res.json({message : err.message})
    

  
    console.log("ErrorHandler run completely")

    next()
}

module.exports = {errorHandler}