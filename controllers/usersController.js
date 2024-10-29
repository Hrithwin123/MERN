const path = require("path")
const User = require(path.join(__dirname, "..", "models", "User.js"))
const Note = require(path.join(__dirname, "..", "models", "Note.js"))
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")


//Get all users
//GET /users
// Private

const getAllUsers = asyncHandler(async(req, res) => {

    const users = await User.find().select("-password").lean()  //lean => gives only js object data instead of MongoDb document

    if(!users?.length){
        return res.status(404).json({message : "No users Found"})
    }


    res.json(users)

})


//Create a new user
//POST /users
// Private

const createNewUser = asyncHandler(async(req, res) => {

    console.log(`data recieved from form : ${req.body}`)
    
    const {username, password, roles} = req.body
    

    //confirming data
    if(!username || !password){
        if(roles){
            if(!Array.isArray(roles)){
                return res.status(400).json({message : "Roles must be an array"})
                
            }
            else if(!roles.length){
                return res.status(400).json({message : "Roles must not be empty"})

            }
        }
        
        return res.status(400).json({message : "All Fields Are Required"})
        
    }
    
    //Check for duplicates
    const duplicate = await User.findOne({username}).lean().exec()
    
    if(duplicate){
        
        return res.status(409).json({message : "Username Already Exists"})
        
    }
    
    //Password hashing
    
    const hashedPassword = await bcrypt.hash(password, 10) 
    
    const userObject = {username, "password" : hashedPassword, roles}
    
    //Create and store the new user

    const user = await User.create(userObject)
    
    if(user){
        res.status(201).json({message : `New User ${username} Created`})
        
    }
    else{
        req.status(400).json({messge : "Invalid user data recieved"})
    }
    
    
})


//Update a new user
//PATCH /users
// Private

const updateUser = asyncHandler(async(req, res) => {
    
    console.log(`data recieved from form : ${req.body}`)

    const {id, username , password, roles, active} = req.body

    //confirm data

    if(!username || String(typeof(active)) !== "boolean"){
        if(roles){

            if(!Array.isArray(roles)){
                return res.status(400).json({message : "Roles must be an array"})
                
            }
            else if(!roles.length){
                return res.status(400).json({message : "Roles must not be empty"})

            }
        }
        
        return res.status(400).json({message : "All Fields Are Required"})
        
    }
    



    const user = await User.findById(id).exec()

    if(!user){

        return res.status(404).json({message : "User not Found"})
    }

    //Check for duplicate

    duplicate = await User.findOne({username}).lean().exec()


    //Allow updates to the original user

    if(duplicate && String(duplicate?._id !== id)){
        return res.status(409).json({message : "Username Already Exists or Id is incorrect"})
    
    }

  

    user.username = username
    user.id = id
    user.roles = roles
    user.active = active

    if(password){
        //hashing password
        user.password = await bcrypt.hash(password, 10)

    }

    const updatedUser = await user.save()

    res.json({message : `${user.username} Updated`})

    console.log(`user has been updated to ${updatedUser}`)


})



//Delete a user
//DELETE /users
// Private

const deleteUser = asyncHandler(async(req, res) => {

    const {id} = req.body

    if(!id){
        return res.status(409).json({message : "User Id is required for deleting a user"})

    }

    const notes = await Note.findOne({user : id})

    if(notes){

        return res.status(400).json({message : "User has assigned notes"})

    }

    const user = await User.findById(id).lean().exec()

    if(!user){
        return res.status(404).json({messgae : "User Not Found"})
    }

    const result = await User.findByIdAndDelete({_id : id})

    const reply = `username ${result.username} with id ${result._id} deleted`

    res.json(reply)

})


module.exports = {updateUser, createNewUser, deleteUser, getAllUsers}
