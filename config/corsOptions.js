const allowedOrigins = require("./allowedOrigins")

const corsOptions = {
    origin : (origin, callback) => {

        if(allowedOrigins.indexOf(origin) !== -1 || !origin){ //indexOf returns -1 if (origin) is not found

            callback(null, true)
        }
        else{
            callback(new Error("Not allowed by CORS"))
        }
    },

    credentials : true, 
    optionsSuccessStatus : 200
}

module.exports = corsOptions