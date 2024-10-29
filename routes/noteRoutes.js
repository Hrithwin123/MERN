const path = require("path")
const express = require("express")
const noteController = require("../controllers/noteController")
const router = express.Router()

router.route("/notes")
    .get(noteController.getNotes)
    .post(noteController.addNote)
    .patch(noteController.editNote)
    .delete(noteController.deleteNote)

module.exports = router