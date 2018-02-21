import * as mysql from 'mysql';

export default () : mysql.Connection => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Sk8mAfIa',
        database: 'payfast'
    });
}
