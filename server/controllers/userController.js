const User = require('../models/userModel')
const bcrypt = require('bcrypt')


module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck)
            return res.json({ msg: "Username already used", status: false });
        const emailCheck = await User.findOne({ email });
        if (emailCheck)
            return res.json({ msg: "Email already used", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch (error) {
        next(error)
    }
}


module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.json({ message: "Incorrect Username or Password", status: false })
        }

        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            return res.json({ message: "Incorrect Username or Password", status: false })
        }

        delete user.password

        return res.json({ status: true, user })
    } catch (error) {
        next(error)
    }
}


module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id
        const avatarImage = req.body.image
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })

        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })

    } catch (error) {
        next(error)
    }
}


module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (error) {
        next(error)
    }
}



module.exports.logout = async (req, res, next) => {
    try {
        if (!req.params.id) return res.json({ msg: "User id is required " });
        onlineUsers.delete(req.params.id);
        return res.status(200).send();
    } catch (ex) {
        next(ex);
    }
};