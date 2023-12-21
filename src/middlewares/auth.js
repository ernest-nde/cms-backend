const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            return res.status(403).json({
                message: `No token provided : You must be logged in first!`
            });
        } else {
            const token = await req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if(err) {
                    return res.status(403).json({
                        message: 'Invalid token : You must be logged in first!'
                    });
                } else {
                    req.decoded = decoded;

                    req.auth = {
                        userId: decoded.id,
                        roleId: decoded.roleId
                    }
                    
                    next();
                }
            });
        }
    } catch (error) {
        next(error);
    }
    
}