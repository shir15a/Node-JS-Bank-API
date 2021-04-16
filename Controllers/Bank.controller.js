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
    // console.log(String(req.body.id).length);
    // const { cash = 0, credit = 0 } = req.body;
    users.push({ id, cash: 0, credit: 0 });
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

//Update credit
const updateCredit = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const user = users.find((user) => user.id === parseInt(id));
    console.log(user);
    if (user) {
        if (amount > 0) {
            user.credit += amount;
            const jsonData = JSON.stringify(bankJson);
            fs.writeFileSync("Json/Bank.json", jsonData);
            return res.status(200).json("Success")
        }
        return res.status(200).json({ error: "Check your amount again- cannot be a negative number or proide value" })

    }
    return res.status(200).json({ error: "Sorry, user not found " })
};

//Withdraw money
const withdrawMoney = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const user = users.find((user) => user.id === parseInt(id));
    console.log(user);
    if (user) {
        if (amount > 0) {
            if (user.cash + user.credit < amount) {
                return res.status(200).json({ error: "Check your amount again" })
            }
            else {
                user.cash -= amount;
                const jsonData = JSON.stringify(bankJson);
                fs.writeFileSync("Json/Bank.json", jsonData);
                return res.status(200).json("Success")
            }
        }
        return res.status(200).json({ error: "Check your amount again- cannot be a negative number or proide value" })
    }
    return res.status(200).json({ error: "Sorry, user not found " })
};

//Transferring
const transferMoney = (req, res) => {
    const { fromUserId, toUserId, amount } = req.body;
    const fromUser = users.find((user) => user.id === parseInt(fromUserId));
    console.log(fromUser);
    const toUser = users.find((user) => user.id === parseInt(toUserId));
    if (!fromUser || !toUser || amount < 0) {
        return res.status(200).json({ error: 'Sorry, check your users or amount again' })
    }
    else if (fromUser.cash + fromUser.credit < amount) {
        return res.status(200).json({ error: 'your cash & credit isnt enough for this transfer' })
    }
    else {
        fromUser.cash -= amount;
        toUser.cash += amount;
        const jsonData = JSON.stringify(bankJson);
        fs.writeFileSync("Json/Bank.json", jsonData);
        return res.status(200).json("Success")
    }
};



module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    deposit,
    updateCredit,
    withdrawMoney,
    transferMoney
};