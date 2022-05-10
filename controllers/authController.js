require('dotenv').config()
const { validationResult } = require('express-validator')
const userService = require('../service/user-service')
const ErrorDto = require('../dtos/error-dto')

class authController{

	async register(req, res, next) {
		try{
			const errors = validationResult(req)
			if(!errors.isEmpty()){
				return next(ErrorDto(400, 'Invalid registration data', errors.array()))
			}

			const {email, password, username} = req.body
			const userData = await userService.registration(email, username, password)
			
			return res.json(userData)
		} catch(e){
			next(e)
		}
	}

	async login(req, res, next) {
		try{
			const errors = validationResult(req)

			if(!errors.isEmpty()){
				return next(ErrorDto(400, 'Invalid login data', errors.array()))
			}

			const {email, password} = req.body
			const userData = await userService.login(email, password)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
			
			res.json({ token: userData.accessToken, userId: userData.id })
		} catch(e){
			next(e)
		}
	}
	
	async logout(req, res, next){
		try{
			const{refreshToken} = req.cookies
			const token = await userService.logout(refreshToken)
			res.clearCookie('refreshToken')
			res.json({token})
		} catch(e){
			next(e)
		}
	}

	async refresh(req, res, next){
		try{
			const {refreshToken} = req.cookies
			const userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
			res.json(userData)
		} catch(e){
			next(e)
		}
		
	}
}
module.exports = new authController()