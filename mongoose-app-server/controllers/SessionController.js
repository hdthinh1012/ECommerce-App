const getSession = (req, res) => {
    console.log("/******************* '/' ********************/");
    console.log(`SessionController's SessionID: ${req.session.id}`);
    console.log("SessionController's Current Sessions Store State", JSON.stringify(req.sessionStore.sessions));
    if (req.session.loggedIn) {
        res.status(200).send(JSON.stringify({ sessionID: req.sessionID, accountInfo: req.session }));
    } else {
        res.status(200).send(JSON.stringify({ sessionID: null, accountInfo: null }));
    }
};

module.exports = {
    getSession
};