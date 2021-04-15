const express = require('express');
const router = express.Router();
const fs = require('fs');

const bankUsersJson = require("./../Bank.json");
const { users } = bankUsersJson;

//Add users
router.post("/", (req, res) => {
    const id = parseInt(users[users.length - 1].id) + 1;
    const { cash = 0, credit = 0 } = req.body;
    users.push({ id, cash, credit });
    return res.status(200).json({ success: "user add to db" });
});

//Depositing
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const user = users.find((user) => user.id === id);
    if (user) {
        if (amount > 0) {
            user.cash += amount;
            return res.status(200).json("Success")
        }
        return res.status(200).json({ error: "Check your amount again- cannot be a negative number or proide value" })

    }
    return res.status(200).json({ error: "Sorry, user not found " })
});

//Update credit


//Withdraw money


//Transferring 


// Show details of all users
router.get("/", (req, res) => {
    return res.status(200).json({ users });
});

//Show details of user
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((user) => user.id === id);
    if (user) return res.status(200).json({ user });
    return res.status(200).json({ error: 'Sorry, user not found' })
});

module.exports = router;