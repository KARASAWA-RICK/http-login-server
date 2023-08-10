//数据库操作方法模块

//导入mysql模块
const mysql = require("mysql")
//导入util模块
const util = require('util')
//导入响应类型模块
const RESPONSE = require("../apps/RESPONSE.js")
//导入日志模块
const log = require("../utils/log.js")


//前置方法（不直接用）

//定义传入数据库信息，连接数据库（创建连接池）的方法
//不直接用，提供给数据库连接模块使用
let conn_pool = null
function connect(host, port, db_name, uname, upwd) {
	//用INFO输出数据库信息
	let str = "连接池信息(\"%s\", \"%s\", \"%s\", \"%s\", \"%s\")"
	let info = util.format(str, host, port, db_name, uname, upwd)
	log.info(info)

	//创建连接池
	conn_pool = mysql.createPool({
		host: host,
		port: port,
		database: db_name,
		user: uname,
		password: upwd,
	})
	log.info("连接数据库")
}

//定义执行sql语句的方法
//传入一个sql语句，一个最终回调函数（3个参数，用于接收error、结果、描述，并处理后续逻辑）
//不直接用，提供给具体的数据库操作方法用
function mysql_exec(sql, callback) {
	//向连接池建立连接
	//定义错误优先的回调函数，接收error、连接
	conn_pool.getConnection((err, conn) => {
		//若连接error，则将error传入最终回调函数，跳出方法
		if (err) {
			if (callback) {
				callback(err, null, null)
			}
			return
		}
		//若连接无error，则执行sql语句
		//定义错误优先的回调函数，接收error、结果、描述
		else {
			conn.query(sql, (sql_err, sql_result, fields_desic) => {

				//执行完毕后立即释放连接
				conn.release()

				//若执行error，则将error对象传入最终回调函数，跳出方法
				if (sql_err) {
					if (callback) {
						callback(sql_err, null, null);
					}
					return
				}
				//若执行无error，则将结果、描述传入最终回调函数
				else if (callback) {
					callback(null, sql_result, fields_desic)
				}
			})
		}
	})
}





//具体的数据库操作方法

//查

//定义通过  uname、upwd  查找用户信息的方法
//传入一个字符串（uname），一个字符串（upwd），一个最终回调函数（2个参数，用于接收执行状态（RESPONSE）、执行结果，并处理后续逻辑）
function get_uinfo_by_uname_upwd(uname, upwd, callback) {
	//确定最终sql语句

	//sql语句：根据根据传入的uname、upwd在user表内查找id、uname、upwd、score、money属性
	let sql = 'select id, uname, upwd, score, money from user where uname = \'%s\' and upwd = \'%s\' and status = 1 limit 1'
	//根据传入的uname、upwd合成最终sql语句
	let sql_cmd = util.format(sql, uname, upwd)
	//用INFO输出最终sql语句
	log.info(sql_cmd)


	//执行sql语句
	//将执行状态（RESPONSE）、执行结果传入最终回调函数
	mysql_exec(sql_cmd, (err, sql_ret, fields_desic) => {
		//若error，则将RESPONSE.SYSTEM_ERR传入最终回调函数，跳出方法
		if (err) {
			callback(RESPONSE.SYSTEM_ERR, null)
			return
		}
		//若无error，则将RESPONSE.OK、执行结果传入最终回调函数
		else {
			callback(RESPONSE.OK, sql_ret)
		}
	})
}

//定义通过  uname  查找用户信息的方法
//传入一个字符串（uname），一个最终回调函数（2个参数，用于接收执行状态（RESPONSE）、执行结果，并处理后续逻辑）
function get_uinfo_by_uname(uname, callback) {
	//确定最终sql语句

	//sql语句：根据根据传入的uname在user表内查找id、uname、upwd、score、money属性
	let sql = 'select id, uname, upwd, score, money from user where uname = \'%s\' and status = 1 limit 1'
	//根据传入的uname合成最终sql语句
	let sql_cmd = util.format(sql, uname)
	//用INFO输出最终sql语句
	log.info(sql_cmd)


	//执行sql语句
	//将执行状态（RESPONSE）、执行结果传入最终回调函数
	mysql_exec(sql_cmd, (err, sql_ret, fields_desic) => {
		//若error，则将RESPONSE.SYSTEM_ERR传入最终回调函数，跳出方法
		if (err) {
			callback(RESPONSE.SYSTEM_ERR, null)
			return
		}
		//若无error，则将RESPONSE.OK、执行结果传入最终回调函数
		else {
			callback(RESPONSE.OK, sql_ret)
		}
	})
}

//定义通过  id  查找用户信息的方法
//传入一个数字（id），一个最终回调函数（2个参数，用于接收执行状态（RESPONSE）、执行结果，并处理后续逻辑）
function get_uinfo_by_id(id, callback) {
	//确定最终sql语句

	//sql语句：根据根据传入的id在user表内查找id、uname、upwd、score、money属性
	let sql = 'select id, uname, upwd, score, money from user where id = %d and status = 1 limit 1'
	//根据传入的id合成最终sql语句
	let sql_cmd = util.format(sql, id)
	//用INFO输出最终sql语句
	log.info(sql_cmd)


	//执行sql语句
	//将执行状态（RESPONSE）、执行结果传入最终回调函数
	mysql_exec(sql_cmd, (err, sql_ret, fields_desic) => {
		//若error，则将RESPONSE.SYSTEM_ERR传入最终回调函数，跳出方法
		if (err) {
			callback(RESPONSE.SYSTEM_ERR, null)
			return
		}
		//若无error，则将RESPONSE.OK、执行结果传入最终回调函数
		else {
			callback(RESPONSE.OK, sql_ret)
		}

	})
}

//定义通过  score降序  查找uname（得分排行）的方法
//传入一个最终回调函数（2个参数，用于接收执行状态（RESPONSE）、执行结果，并处理后续逻辑）
function rank_score(callback) {
	let sql = 'select uname, score from user order by score desc'
	let sql_cmd = sql
	log.info(sql_cmd)

	mysql_exec(sql_cmd, function (err, sql_ret, fields_desic) {
		if (err) {
			callback(RESPONSE.SYSTEM_ERR)
			return
		}
		log.info(sql_ret);
		callback(RESPONSE.OK, sql_ret)
	})
}



//改

//定义通过  id  修改score、money的方法
//传入一个数字（id），一个字符串（目标score），一个字符串（目标money），一个最终回调函数（1个参数，用于接收执行状态（RESPONSE），并处理后续逻辑）
function update_score_and_money(id, score, money, callback) {
	let sql = 'update user set score = %d, money = %d where id = %d'
	let sql_cmd = util.format(sql, score, money, id)
	log.info(sql_cmd)

	mysql_exec(sql_cmd, function (err, sql_ret, fields_desic) {
		if (err) {
			callback(RESPONSE.SYSTEM_ERR)
			return
		}
		callback(RESPONSE.OK)
	})
}



//增

//定义通过  uname、upwd  添加新用户的方法
//传入一个字符串（uname），一个字符串（upwd），一个最终回调函数（1个参数，用于接收执行状态（RESPONSE），并处理后续逻辑）
function insert_uinfo_by_uname_upwd(uname, upwd, callback) {
	//确定最终sql语句

	//sql语句：根据传入的uname、upwd向user表内的uname、upwd属性增加新数据
	let sql = 'insert into user (`uname`, `upwd`) values (\'%s\', \'%s\')'
	//根据传入的id合成最终sql语句
	let sql_cmd = util.format(sql, uname, upwd)
	//用INFO输出最终sql语句
	log.info(sql_cmd)

	//执行sql语句
	//将执行状态（RESPONSE）、执行结果传入最终回调函数
	mysql_exec(sql_cmd, function (err, sql_ret, fields_desic) {
		//若error，则将RESPONSE.SYSTEM_ERR传入最终回调函数，跳出方法
		if (err) {
			callback(RESPONSE.SYSTEM_ERR)
			return
		}
		//若无error，则将RESPONSE.OK传入最终回调函数
		else {
			callback(RESPONSE.OK)
		}
	})
}



//导出
module.exports = {
	connect: connect,
	get_uinfo_by_uname: get_uinfo_by_uname,
	insert_uinfo_by_uname_upwd: insert_uinfo_by_uname_upwd,
	get_uinfo_by_uname_upwd: get_uinfo_by_uname_upwd,
	update_score_and_money: update_score_and_money,
	get_uinfo_by_id: get_uinfo_by_id,
	rank_score: rank_score,
}