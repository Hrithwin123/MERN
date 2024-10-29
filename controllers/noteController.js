const path = require("path")
const User = require(path.join(__dirname, "..", "models", "User.js"))
const Note = require(path.join(__dirname, "..", "models", "Note.js"))
const asyncHandler = require("express-async-handler")

const getNotes = asyncHandler(async(req, res) => {

    const notes = await Note.find().select("-__v").lean()

    if(!notes?.length){

        return res.status(404).json({message : "No notes found"})

    }

    res.json(notes)

})

const addNote = asyncHandler(async(req, res) => {

    console.log(`Data recieved from req.body ${req.body}`)

    const {title, text, user} = req.body
    

    //data confirmation
    if(!title || !text || !user){

        if(String(typeof(completed)) != "boolean"){

            return res.status(409).json({message : "please enter a valid Completed status (true/false)"})

        }

        return res.status(409).json({message : "Name, Title and Text is required for a creating a Note"})

    }

    const newNote = {user, title , text, completed : false}

    const note = await Note.create(newNote)

    if(note){
        return res.json({message : `New Note ${title} created`})
    }
    else{
        return res.status(409).json({message : "Invalid data recieved try again!"})

    }

})

const editNote = asyncHandler(async(req, res) => {

    console.log(`Data revieved from req.body ${req.body}`)

    const {user, title, text, completed, id} = req.body


    if(!id){
        return res.status(409).json({message : "Note cannot be deleted without id"})
    }

    if(!title || !text){

        if(String(typeof(completed)) != "boolean" || !completed?.length){

            return res.status(409).json({message : "please enter a valid Completed status (true/false)"})

        }

        return res.status(409).json({message : "Title and Text is required for a creating a Note"})

    }


    const note = await Note.findOne({_id : id}).exec()

    if(!note){
        return res.status(404).json({message : "Note not found"})

    }


    note.user = user
    note.title = title
    note.text = text
    note.completed = completed
    

    const updatedNote = await note.save()
    
    console.log(`note has been updated to ${updatedNote}`)



    return res.json({message : `${id} has been updated`})

})

const deleteNote = asyncHandler(async(req, res) => {

    const {id} = req.body

    if(!id){
        return res.status(409).json({message : "The id entered wasnt recieved"})
    }

    const note = await Note.findOne({_id : id})

    if(!note){
        return res.status(409).json({message : "The Note is not found"})
    }

    const foundNote = await Note.findByIdAndDelete({_id : id})

    console.log(`The note of id ${id} has been deleted`)

    return res.json({message : `the note of id ${id} has been deleted`})


})

module.exports = {deleteNote, addNote, editNote, getNotes}

