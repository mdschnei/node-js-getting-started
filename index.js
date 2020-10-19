const cool = require('cool-ascii-faces')
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})
const express = require('express')
const bodyParser = require('body-parser');
const path = require('path')
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
      client.query('INSERT into test_table values (3, "dynamically added value")');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


express().post('/addRow', jsonParser, async function(request, response) {
  console.log(request)
  try {
    const client = await pool.connect();
    client.query('INSERT into test_table values (3, "dynamically added value")');
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
 
  
// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
/*   if (!exists) {
    console.log("Table not found");
    db.run('CREATE TABLE userlist (user text, password text');
    console.log('New table User List Created!');
    insert(request);
  }
  else{
    insert(request);
  }
  db.each('SELECT * from userlist', function(err, row) {
      if ( row ) {
        console.log('record:', JSON.stringify(row));
      }
    }); */
});
