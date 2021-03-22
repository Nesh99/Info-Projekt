const sqlite3 = require('sqlite3')

/**
 * Data Access Object for using sqlite3 database
 */
class AppDAO {

    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log('Could not connect to database', err);
            } else {
                console.log('Connected to database');
            }
        })
    }

    // run sql-query
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql ' + sql);
                    console.error(err);
                    reject(err);
                } else {
                    resolve({ result });
                }
            });
        } );
    }

    // get single row from table
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    // get all rows from table
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = AppDAO;