const express = require('express');
const router = express.Router();

const bankController = require("./../Controllers/Bank.controller");

router
    .get("/", bankController.getAllUsers)
    .get("/sortByAmountOfCash", bankController.sortByAmountOfCash)
    .get("/:id", bankController.getUserById)
    .get("/getActiveUsersWithSpecifiedAmount/:amount", bankController.activeUserAndSpecifiedAmount)
    .post("/", bankController.addUser)
    .put("/depositing/:id", bankController.deposit)
    .put("/update/:id", bankController.updateCredit)
    .put("/withdraw/:id", bankController.withdrawMoney)
    .put("/transform", bankController.transferMoney)

module.exports = router;
