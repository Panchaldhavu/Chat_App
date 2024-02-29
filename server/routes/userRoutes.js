const { register, login, setAvatar, getAllUsers, logout } = require('../controllers/userController')

const router = require('express').Router()


router.post('/register' , register)
router.post('/login' , login)
router.post('/setAvatar/:id' ,setAvatar )
router.get('/alluser/:id' , getAllUsers)
router.get('/logout/:id' , logout)



module.exports = router