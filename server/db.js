import mysql from "mysql2"
import {exec} from "child_process"
import util from "util"

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

export const dumpCommand = `MYSQL_PWD=${process.env.DB_PASSWORD} mysqldump -u ${process.env.DB_USER} --socket=${process.env.DB_SOCKET} --no-data ${process.env.DB_NAME} --column-statistics=0`;
export const execAsync = util.promisify(exec);

export default connection
