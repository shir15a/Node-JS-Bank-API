const express = require('express');
const router = express.Router();

const bankController = require("./../Controllers/Bank.controller");

router
.get("/", bankController.getAllUsers)
.get("/:id", bankController.getUserById)
.post("/", bankController.addUser)
.put("/:id",bankController.deposit)

module.exports = router;
