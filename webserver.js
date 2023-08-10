//服务器

//导入express模块
const express = require("express")
const app = express()
//导入body-parser模块
const bodyParser = require('body-parser')
//导入日志模块
const log = require("./utils/log.js")
//导入响应类型模块
const RESPONSE = require('./apps/RESPONSE.js')
//导入数据库连接模块（创建连接池）
require("./center_server.js")
//导入数据库操作方法模块
const mysql_center = require("./database/mysql_center.js")



//监听端口，启动服务
app.listen(6080, () => { log.info('6080端口服务启动') })




//中间件

//跨域访问全局中间件
app.all('*', (req, res, next) => {
	//设置响应头

	//设置允许跨域
	res.header("Access-Control-Allow-Origin", "*")
	//设置允许的请求头（常用于身份校验）
	res.header("Access-Control-Allow-Headers", "X-Requested-With")
	//设置允许的请求方法
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")


	res.header("X-Powered-By", ' 3.2.1')
	//设置响应体为json格式
	//设置utf-8转码，纠正中文乱码
	res.header("Content-Type", "application/json;charset=utf-8")

	//跳转下一个中间件
	next()
})




//路由函数



//GET

//注册路由函数
app.get("/register", (request, response) => {
	//收到注册请求
	console.log("/register comming")




	//1.获取请求

	//获取请求行的查询参数中的uname、upwd
	let uname = request.query.uname
	let upwd = request.query.upwd
	console.log(uname + "," + upwd)



	//2.根据获取的请求执行数据库操作

	//执行查找用户信息的方法（查重）
	mysql_center.get_uinfo_by_uname(uname, (status, data) => {
		//若已有同名用户名
		if (data.length >= 1) {
			//将执行状态（RESPONSE）打包成新对象
			let responseObj = {}
			responseObj.status = RESPONSE.PHONE_IS_NOT_REG

			//3.设置响应体为新对象，发送响应
			response.send(responseObj)
		}
		//若没有同名用户名
		else {
			//执行添加新用户的方法
			mysql_center.insert_uinfo_by_uname_upwd(uname, upwd, (status) => {
				//输出执行状态
				log.info("插入数据返回:" + status)



				//执行查找用户信息的方法
				mysql_center.get_uinfo_by_uname_upwd(uname, upwd, (status, data) => {
					//若执行状态（RESPONSE）为OK
					if (status == RESPONSE.OK) {
						//获取结果数组中的结果对象
						let sql_uinfo = data[0]

						//将执行状态（RESPONSE）、结果对象中的属性（id、uname、upwd、score、money）组合打包成新对象
						let responseObj = {}
						responseObj.status = RESPONSE.OK
						responseObj.id = sql_uinfo.id
						responseObj.uname = sql_uinfo.uname
						responseObj.upwd = sql_uinfo.upwd
						responseObj.score = sql_uinfo.score
						responseObj.money = sql_uinfo.money

						//3.设置响应体为新对象，发送响应
						response.send(responseObj)
					}
					//若执行状态（RESPONSE）不为OK
					else {
						//将执行状态（RESPONSE）打包成新对象
						let responseObj = {}
						responseObj.status = RESPONSE.SYSTEM_ERR

						//3.设置响应体为新对象，发送响应
						response.send(responseObj)
					}
				})
			})
		}
	})
})



//登录路由函数
app.get("/login", (request, response) => {
	//收到登录请求
	console.log("/login comming")




	//1.获取请求

	//获取请求行的查询参数
	console.log(request.query)
	//获取请求行的查询参数中的uname、upwd
	let uname = request.query.uname
	let upwd = request.query.upwd
	console.log(uname + "," + upwd)



	//2.根据获取的请求执行数据库操作

	//执行查找用户信息的方法
	mysql_center.get_uinfo_by_uname(uname, (status, data) => {
		//输出执行状态
		log.info("登陆返回:" + status)



		//若执行状态（RESPONSE）不为OK
		if (status != RESPONSE.OK) {
			//将状态执行状态（RESPONSE）打包成新对象
			let responseObj = {}
			responseObj.status = RESPONSE.SYSTEM_ERR

			//3.设置响应体为新对象，发送响应
			response.send(responseObj)
		}
		//若执行状态（RESPONSE）为OK
		else {
			//获取结果数组长度
			log.info("登陆返回2:" + data.length)

			//若结果数组长度 <= 0（没有该账号)
			if (data.length <= 0) {
				//将状态执行状态（RESPONSE）打包成新对象
				let responseObj = {}
				responseObj.status = RESPONSE.SYSTEM_ERR

				//3.设置响应体为新对象，发送响应
				response.send(responseObj)
			}
			//若结果数组长度 > 0（有该账号)
			else {
				//获取结果数组中的结果对象
				let sql_uinfo = data[0]
				//输出结果对象中的uname、upwd、score、money
				log.info("sql_uinfo:" + sql_uinfo.uname + "," + sql_uinfo.upwd + "," + sql_uinfo.score + "," + sql_uinfo.money)

				//若密码不正确
				if (upwd != sql_uinfo.upwd) {
					//将状态执行状态（RESPONSE）打包成新对象
					let responseObj = {}
					responseObj.status = RESPONSE.UNAME_OR_UPWD_ERR

					//3.设置响应体为新对象，发送响应
					response.send(responseObj)
				}
				//若密码正确
				else {
					//将执行状态（RESPONSE）、结果对象中的属性（id、uname、upwd、score、money）组合打包成新对象
					let responseObj = {}
					responseObj.status = RESPONSE.OK
					responseObj.id = sql_uinfo.id
					responseObj.uname = sql_uinfo.uname
					responseObj.upwd = sql_uinfo.upwd
					responseObj.score = sql_uinfo.score
					responseObj.money = sql_uinfo.money

					//3.设置响应体为新对象，发送响应
					response.send(responseObj)
				}
			}
		}
	})
})




//修改得分金币路由函数
app.get("/update_score_and_money", (request, response) => {
	//收到修改得分请求
	console.log("/update_score_and_money comming")

	//获取请求行的查询参数中的id、score、money
	let id = request.query.id
	let score = request.query.score
	let money = request.query.money

	//执行修改得分金币的方法
	mysql_center.update_score_and_money(id, score, money, (status) => {
		//输出执行状态
		log.info("update_score_and_money返回:" + status)
		//若执行状态（RESPONSE）为OK
		if (status == RESPONSE.OK) {
			//将状态执行状态（RESPONSE）打包成新对象
			let responseObj = {}
			responseObj.status = RESPONSE.OK

			//设置响应体为新对象，发送响应
			response.send(responseObj)
		}
	})
})



//得分排行路由函数
app.get("/rank_score", (request, response) => {
	//收到得分排行请求
	console.log("/update_score comming")

	//执行得分排行的方法
	mysql_center.rank_score((status, data) => {
		//输出执行状态、结果数组长度
		log.info("rank_score返回:" + status + "," + data.length)
		//若执行状态（RESPONSE）为OK
		if (status == RESPONSE.OK) {
			//将状态执行状态（RESPONSE）、结果数组打包成新对象
			let responseObj = {}
			responseObj.status = response.OK
			responseObj.data = []
			for (let i = 0; i < data.length; i++) {
				responseObj.data.push({ uname: data[i].uname, score: data[i].score })
			}

			//设置响应体为新对象，发送响应
			response.send(responseObj)
		}
	})
})



//POST

//定义路由中间件函数
let jsonParser = bodyParser.json()

//上传路由函数
app.post("/upload", jsonParser, (request, response) => {
	//收到上传请求
	console.log("/upload comming")
	//获取请求行的查询参数
	console.log(request.query)
	//获取请求体
	console.log(request.body)

	//将状态执行状态（RESPONSE）打包成新对象
	let responseObj = {}
	responseObj.status = RESPONSE.OK
	////设置响应体为新对象，发送响应
	response.send(responseObj)
})

