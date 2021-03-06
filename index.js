const cool = require('cool-ascii-faces')
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000

var jsonParser = bodyParser.json();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/users', function(req, res) {
    console.log("Requesting...")
    request('https://jsonplaceholder.typicode.com/users', function(error, response, body) {
        // console.log(error);
        // console.log(response);
        // console.log(body);
        res.json(body)
      });
  })
  .post('/addRow', jsonParser, async function(req, res) {
    console.log(req.body)
    console.log(req.body.id, req.body.name)
    try {
      const client = await pool.connect();
      client.query(`INSERT into test_table values (${req.body.id}, '${req.body.name}')`);
      client.release();
      res.send("Success! " + res);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .post('/deleteRow', jsonParser, async function(req, res) {
    console.log(req.body)
    console.log(req.body.id)
    try {
      const client = await pool.connect();
      client.query(`DELETE from test_table where id=${req.body.id}`);
      client.release();
      res.send("Success! " + res);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
