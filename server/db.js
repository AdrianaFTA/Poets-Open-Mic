const { Pool } = require("pg");
if(!process.env.PG_USER || !process.env.PG_HOST || !process.env.PG_DATABASE || !process.env.PG_PORT){
    console.error("FATAL ERROR: Database enviroment variables (PG_USER, PG_HOST, etc.) are missing");
}

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  
});
pool.on('connect', () => {
    console.log('Database connected successfully');
});
pool.on('error', (err, client) =>{
    console.error('Unexpected error on idle client', err);
});
module.exports = pool;