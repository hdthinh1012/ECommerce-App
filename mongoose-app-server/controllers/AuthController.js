const User = require("../databases/User");
const customEncryption = require("../modules/encryption");

const login = async (req, res) => {
    const body = req.body;
    const isEmailExist = await User.exists({ email: body.email });
    if (!isEmailExist) {
        res.status(409).send(JSON.stringify({
            message: "Email not matching"
        }));
    } else {
        currentUser = await User.findOne({ email: body.email });
        if (await customEncryption.comparePassword(body.password, currentUser.password)) {
            req.session.regenerate(function (err) {
                // will have a new session here         
                req.session.loggedIn = true;
                currentUser.password = "";;
                req.session.userInfo = currentUser;
                req.session.save((err) => { });
                res.status(200).send(JSON.stringify({
                    message: `Login success account`,
                    session: JSON.stringify(req.session),
                }))
            })
        } else {
            res.status(409).send(JSON.stringify({
                message: "Invalid password",
            }))
        }
    }
};

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout destroy session error");
        }
    });
    res.status(200).send(JSON.stringify({ message: "Logout success" }))
};

const register = async (req, res) => {
    const body = req.body;
    const isEmailExist = await User.exists({ email: body.email });
    if (isEmailExist) {
        res.status(409).send(JSON.stringify({
            message: 'Email Exists',
        }))
    } else {
        const hashedPassword = await customEncryption.hashPassword(body.password);
        const newUser = new User({
            username: body.username,
            email: body.email,
            password: hashedPassword,
            isCertified: false,
        });
        newUser.save((err) => {
            if (err) {
                console.log("Save new registered user err", err);
            }
        })
        res.status(200).send(JSON.stringify({ message: "Register success" }));
    }
};

module.exports = {
    login: login,
    logout: logout,
    register: register,
};