const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    // Bearer <token>
    const bearerToken = token.split(' ')[1];

    if (!bearerToken) {
        return res.status(403).send({ message: 'Malformed token!' });
    }

    jwt.verify(bearerToken, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isCoordinador = (req, res, next) => {
    if (req.userRole !== 'Coordinador') {
        return res.status(403).send({ message: 'Require Coordinador Role!' });
    }
    next();
};

module.exports = {
    verifyToken,
    isCoordinador
};
