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
    if (user) return res.status(200).json({ user });
    return res.status(200).json({ error: 'Sorry, user not found' })
};

// Add user
const addUser = (req, res) => {
    const { id } = req.body;
    if (!checkifUserExist(id)) {
        users.push({ id, cash: 0, credit: 0 });
        const jsonData = JSON.stringify(bankJson);
        fs.writeFileSync("Json/Bank.json", jsonData);
        return res.status(200).json({ success: "user add to db" });
    }
    return res.status(200).json({ error: "this id is alreade exist in db" });
};

//Depositing
const deposit = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const user = users.find((user) => user.id === parseInt(id));
    if (checkifUserExist(id)) {
        if (!checkAmount(amount).error) {
            user.cash += amount;
            const jsonData = JSON.stringify(bankJson);
            fs.writeFileSync("Json/Bank.json", jsonData);
            return res.status(200).json("Success")
        }
        return res.json({ error: checkAmount(amount).error })
    }
    return res.status(200).json({ error: "Sorry, user not found" })
};

//Update credit
const updateCredit = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const user = users.find((user) => user.id === parseInt(id));
    if (checkifUserExist(id)) {
        if (!checkAmount(amount).error) {
            user.credit += amount;
            const jsonData = JSON.stringify(bankJson);
            fs.writeFileSync("Json/Bank.json", jsonData);
            return res.status(200).json("Success")
        }
        return res.json({ error: checkAmount(amount).error })
    }
    return res.status(200).json({ error: "Sorry, user not found " })
};

//Withdraw money
const withdrawMoney = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const user = users.find((user) => user.id === parseInt(id));
    console.log(user);
    if (checkifUserExist(id)) {
        if (!checkAmount(amount).error) {
            if (checkWithdraw(id, amount)) {
                return res.status(200).json({ error: "Check your amount again" })
            }
            else {
                user.cash -= amount;
                const jsonData = JSON.stringify(bankJson);
                fs.writeFileSync("Json/Bank.json", jsonData);
                return res.status(200).json("Success")
            }
        }
        return res.json({ error: checkAmount(amount).error })
    }
    return res.status(200).json({ error: "Sorry, user not found " })
};

//Transferring
const transferMoney = (req, res) => {
    const { fromUserId, toUserId, amount } = req.body;
    const fromUser = users.find((user) => user.id === parseInt(fromUserId));
    console.log(fromUser);
    const toUser = users.find((user) => user.id === parseInt(toUserId));
    if (!fromUser || !toUser || amount < 0 || fromUserId === toUserId) {
        return res.status(200).json({ error: 'Sorry, check your users or amount again' })
    }
    else if (!checkWithdraw(fromUserId, amount)) {
        return res.status(200).json({ error: 'your cash & credit arent enough for this transfer' })
    }
    else {
        fromUser.cash -= amount;
        toUser.cash += amount;
        const jsonData = JSON.stringify(bankJson);
        fs.writeFileSync("Json/Bank.json", jsonData);
        return res.status(200).json("Success")
    }
};

const checkifUserExist = (id) => {
    const user = users.find((user) => user.id === parseInt(id));
    if (user) return true;
    return false;
}

const checkAmount = (amount)=>{
    if(!amount) return { error: "please put amount" };
    else if (amount < 0) return{ error: "amount should be a positive number" };
    return { error: false };
}

const checkWithdraw = (id, amount) =>{
    const user = users.find((user) => user.id === parseInt(id));
    if (user.cash + user.credit < amount) return false;
    return true;
}


module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    deposit,
    updateCredit,
    withdrawMoney,
    transferMoney
};