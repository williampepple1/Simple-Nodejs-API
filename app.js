const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');


const app = express()
const port = process.env.PORT || 5000


app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())


//MySQL

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'nodejs_beers'
});

//Get all data



app.get('', (req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from beers', (err, rows) => {
            connection.release()

            if(!err) {
                res.send(rows)
            }else{
                console.log(err)
            }
        })

    })
})

app.get('/:id', (req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)
 
        connection.query('SELECT * from beers WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err) {
                res.send(rows)
            }else{
                console.log(err)
            }
        })

    })
})

//delete a record
app.delete('/:id', (req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)
 
        connection.query('DELETE from beers WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err) {
                res.send(`Beer with the Record ID: ${req.params.id} has been removed`)
            }else{
                console.log(err)
            }
        })

    })
})
// Add a record

app.post('', (req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)
 
        const params = req.body


        connection.query('INSERT INTO beers SET ?', params, (err, rows) => {
            connection.release()

            if(!err) { 
                res.send(`Beer with the Record ID: ${params.id} has been added`)
            }else{
                console.log(err)
            }
        })
        console.log(req.body)
    })
})

// update records 
app.put('', (req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)
 
        const {id, name, tagline, description, image} = req.body


        connection.query('UPDATE beers SET name = ?, tagline=? WHERE id= ?', [name,tagline, id], (err, rows) => {
            connection.release()

            if(!err) { 
                res.send(`Beer with the Record ID: has been updated`)
            }else{
                console.log(err)
            }
        })
        console.log(req.body)
    })
})





//Listening on env port

app.listen(port, () => console.log(`Listen on port ${port}`))