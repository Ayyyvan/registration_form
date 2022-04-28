const config = require('config')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || config.get('jwtSecret')


module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS'){
		return next()
	}

	try{

		const token = req.headers.authorization.split(' ')[1]

		if(!token){
			res.status(401).json({ message: 'No authorization'})
		}

		const decoded = jwt.verify(token, jwtSecret)
		req.user = decoded
		next()

	} catch(e){
		res.status(401).json({ message: 'No authorization'})
	}
}