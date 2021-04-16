const express = require('express');
const router = express.Router();

const bankController = require("./../Controllers/Bank.controller");

router
.get("/", bankController.getAllUsers)
.get("/:id", bankController.getUserById)
.post("/", bankController.addUser)
.put("/depositing/:id",bankController.deposit)
.put("/update/:id",bankController.updateCredit)
.put("/withdrawMoney/:id",bankController.withdrawMoney)
.put("/transferMoney/:id",bankController.transferMoney)



module.exports = router;
