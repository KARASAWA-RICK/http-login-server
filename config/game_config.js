//数据库信息模块

//数据库选项
const game_config = {
	
	//本机root的game数据库
	center_database: {
		host: "127.0.0.1",
		port: 3306,
		db_name: "game",

		uname: "root",
		upwd: "root",
	},
	
	//公网
	center_database2: {
		host: "103.70.227.14",
		port: 3306,
		db_name: "1005zhihuiok",

		uname: "1005zhihuiok",
		upwd: "7sLac56tmLchZwyP",
	},
	
}

//导出
module.exports = game_config