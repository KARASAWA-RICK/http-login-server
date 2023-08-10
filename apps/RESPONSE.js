//响应类型模块

//响应类型选项
const RESPONSE = {
	OK: 1, // 表示成功

	SYSTEM_ERR: -101, // 系统错误
	ILLEGAL_ACCOUNT: -102, // 非法的账号

	INVALIDI_OPT: -103, // 非法的操作
	PHONE_IS_REG: -104, // 手机已经被绑定
	PHONE_CODE_ERR: -105, // 手机验证码错误
	UNAME_OR_UPWD_ERR: -106, // 用户名或密码错误
	PHONE_IS_NOT_REG: -107, // 手机号为非法的账号
	RANK_IS_EMPTY: -108, // 排行榜为空

	CHIP_IS_NOT_ENOUGH: -110, // 金币不足 
}

//导出
module.exports = RESPONSE