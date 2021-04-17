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
    if (!checkifNewUserIsValid(id).error) {
        users.push({ id, cash: 0, credit: 0, isActive: true });
        const jsonData = JSON.stringify(bankJson);
        fs.writeFileSync("Json/Bank.json", jsonData);
        return res.status(200).json({ success: "user add to db" });
    }
    return res.status(200).json({ error: checkifNewUserIsValid(id).error });
};

//Depositing
const deposit = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const user = users.find((user) => user.id === parseInt(id));
    if (checkifUserExist(id)) {
        if (!checkIdAndAmount(id, amount).error && user.isActive) {
            user.cash += amount;
            const jsonData = JSON.stringify(bankJson);
            fs.writeFileSync("Json/Bank.json", jsonData);
            return res.status(200).json("Success")
        }
        return res.json({ error: checkIdAndAmount(id, amount).error })
    }
    return res.status(200).json({ error: "Sorry, user not found or not active" })
};

//Update credit
const updateCredit = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const user = users.find((user) => user.id === parseInt(id));
    if (checkifUserExist(id)) {
        if (!checkIdAndAmount(id, amount).error) {
            user.credit += amount;
            const jsonData = JSON.stringify(bankJson);
            fs.writeFileSync("Json/Bank.json", jsonData);
            return res.status(200).json("Success")
        }
        return res.json({ error: checkIdAndAmount(id, amount).error })
    }
    return res.status(200).json({ error: "Sorry, user not found or not active" })
};

//Withdraw money
const withdrawMoney = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const user = users.find((user) => user.id === parseInt(id));
    if (checkifUserExist(id)) {
        if (!checkIdAndAmount(id, amount).error) {
            if (!checkWithdraw(id, amount)) {
                return res.status(200).json({ error: "Check your amount again" })
            }
            else {
                user.cash -= amount;
                const jsonData = JSON.stringify(bankJson);
                fs.writeFileSync("Json/Bank.json", jsonData);
                return res.status(200).json("Success")
            }
        }
        return res.json({ error: checkIdAndAmount(id, amount).error })
    }
    return res.status(200).json({ error: "Sorry, user not found or not active" })
};


//Transferring
const transferMoney = (req, res) => {
    const { fromUserId, toUserId, amount } = req.body;
    const fromUser = users.find((user) => user.id === parseInt(fromUserId));
    const toUser = users.find((user) => user.id === parseInt(toUserId));
    if (!fromUser || !toUser || amount < 0 || fromUserId === toUserId || !fromUser.isActive || !toUser.isActive) {
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

// Sort by amount of cash - Hero 1 
const sortByAmountOfCash = (req, res) => {
    users.sort((a, b) => a.cash - b.cash);
    return res.status(200).json({ users });
}

// Users that are active and have a specified amount of cash - Ninja 2
const activeUserAndSpecifiedAmount = (req, res) => {
    const { amount } = req.params;
    const activeUserWithSpecifiedAmount = users.filter((user) => user.isActive && user.cash >= parseInt(amount))
    return res.status(200).json({ activeUserWithSpecifiedAmount });
}

// Validations
const checkifUserExist = (id) => {
    const user = users.find((user) => user.id === parseInt(id));
    if (user && user.isActive) return true;
    return false;
}

const checkifNewUserIsValid = (id) => {
    const user = users.find((user) => user.id === parseInt(id));
    if (!id) return { error: "Please provide id" };
    else if (!isIsraeliIdNumber(id)) return { error: "Invalid Israeli id" };
    else if (user) return { error: "ID already exists in db" };
    return { error: false };
}

const checkIdAndAmount = (id, amount) => {
    // if (!amount) return { error: "please put amount" };
    // else if (amount < 0) return { error: "amount should be a positive number" };
    // return { error: false };
    const user = users.find((user) => user.id === parseInt(id));
    if (!amount || !id) return { error: "please put amount && id" };
    else if (amount < 0) return { error: "amount should be a positive number" };
    else if (!isIsraeliIdNumber(id)) return { error: "Invalid Israeli Id" };
    return { error: false };
}

const checkWithdraw = (id, amount) => {
    const user = users.find((user) => user.id === parseInt(id));
    if (user.cash + user.credit < amount) return false;
    return true;
}

const isIsraeliIdNumber = (id) => {
    id = String(id).trim();
    if (id.length > 9 || isNaN(id)) return false;
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
    return Array.from(id, Number).reduce((counter, digit, i) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
    }) % 10 === 0;
}


module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    deposit,
    updateCredit,
    withdrawMoney,
    transferMoney,
    sortByAmountOfCash,
    activeUserAndSpecifiedAmount
};