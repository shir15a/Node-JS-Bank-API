const fs = require("fs");
const bankJson = require("./../Json/Bank.json");

const { users } = bankJson;

// Show details of all users
const getAllUsers = (req, res) => {
    return res.status(200).json({ users });
};

//Show details of user
const getUserById = (req, res) => {
    const { id } = req.params;
    const user = users.find((user) => user.id === parseInt(id));
    console.log(user);
    if (user) return res.status(200).json({ user });
    return res.status(200).json({ error: 'Sorry, user not found' })
};

// Add user
const addUser = (req, res) => {
    // const id = req.body.id;
    const { id } = req.body;
    // const { cash = 0, credit = 0 } = req.body;
    users.push({ id, cash : 0, credit : 0 });
    const jsonData = JSON.stringify(bankJson);
    fs.writeFileSync("Json/Bank.json", jsonData);
    return res.status(200).json({ success: "user add to db" });
};

//Depositing
const deposit = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const user = users.find((user) => user.id === parseInt(id));
    console.log(user);
    if (user) {
        if (amount > 0) {
            user.cash += amount;
            const jsonData = JSON.stringify(bankJson);
            fs.writeFileSync("Json/Bank.json", jsonData);
            return res.status(200).json("Success")
        }
        return res.status(200).json({ error: "Check your amount again- cannot be a negative number or proide value" })

    }
    return res.status(200).json({ error: "Sorry, user not found " })
};


module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    deposit
};