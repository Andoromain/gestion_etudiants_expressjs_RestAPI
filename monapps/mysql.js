var mysql=require('mysql')
var conn=mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'',
    database:'gestionnotem1'
})

exports.conn=conn;