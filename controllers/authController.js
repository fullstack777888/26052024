// const {getCustomerByUserName} = require('../db/customers')
// const bcrypt = require('bcrypt')


const login = async (req, res) => {
    try {
        const formData = req.body
        const password = req.body.password;
        const user_name = req.body.user_name;

        const user = await getCustomerByUserName(user_name)
        if (!user) {
            return res.render('register.ejs', { message: `There is no such user ${user_name}`, formData })
        }
        const isPasswordOk = await bcrypt.compare(password, user?.password)

        if (!isPasswordOk) { //also check if params is valid
            return res.render('register.ejs', { message: `The password is wrong`, formData })
        } else {
            const jwtToken = jwt.sign({ id: user.id, user_name: user.user_name }, SECRET, { expiresIn: '10m' })
            console.log(jwtToken)
            res.cookie('user_token', jwtToken, { httpOnly: true })
            return res.redirect('/')
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('something went wrong');
    }
}

const logout = (req,res)=>{

}


module.exports = {
    login,
    logout
}