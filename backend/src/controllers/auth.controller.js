const { getConnection, sql } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('Username', sql.NVarChar, username)
            .execute('sp_Login');

        if (result.recordset.length === 0) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const user = result.recordset[0];

        const passwordIsValid = bcrypt.compareSync(
            password,
            user.PasswordHash
        );

        if (!passwordIsValid) {
            return res.status(401).send({ accessToken: null, message: 'Invalid Password!' });
        }

        const token = jwt.sign({ id: user.Id, role: user.Role }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            id: user.Id,
            username: user.Username,
            fullName: user.FullName,
            role: user.Role,
            accessToken: token
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    login
};
