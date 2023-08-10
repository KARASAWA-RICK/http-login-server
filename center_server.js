//数据库连接模块

//导入数据库信息模块
const game_config = require("./config/game_config.js")
//导入log模块
const log = require("./utils/log.js")
//导入数据库操作方法模块
const mysql_center = require("./database/mysql_center.js")

//选择数据库
const center_mysql_config = game_config.center_database

//连接数据库（创建连接池）
mysql_center.connect(center_mysql_config.host, center_mysql_config.port, center_mysql_config.db_name, center_mysql_config.uname, center_mysql_config.upwd)
