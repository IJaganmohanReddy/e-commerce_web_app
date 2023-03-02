const express= require('express');
const app= express();
const routes= require('./routes/index')
const errorHandler= require('./middlewares/errorHandler')

const config= require('./config/index.js');
const mongoose = require('mongoose');
const {PORT, DB_URL}= config ;

mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology:true})// , useFindAndModify:false
//.catch((err)=>console.log("---->",err))  //const MyModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
const db= mongoose.connection;
//console.log(db)
db.on('error', console.error.bind(console, 'db connection error:'))
db.once('open',()=>console.log("db connected successfully..."))

app.use(express.json())
app.use('/api',routes)



app.use(errorHandler)
app.listen(PORT,()=>{console.log(`e-Commerce app is listening on port ${PORT}`)})

