const bcrypt = require("bcrypt");

async function hashPassword(password) {
    let hashedPassword;
    try {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
        // console.log(salt);
        // console.log(hashedPassword);
    } catch (err) {
        console.log("Hash process error:", err);
    }
    return hashedPassword;
}

async function comparePassword(password, hashedPassword) {
    try {
        const result = await bcrypt.compare(password, hashedPassword);
        return result;
    } catch (err) {
        console.log("Compare password error:", err);
    }
}

module.exports = {
    hashPassword: hashPassword,
    comparePassword: comparePassword,
};