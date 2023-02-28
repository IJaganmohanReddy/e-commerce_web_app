const app= require('express')();

const config= require('./config/index.js')
const PORT= config.PORT ;


app.listen(PORT,()=>{console.log(`e-Commerce app is listening on port ${PORT}`)})

app.get('/',(req,res)=>{res.send("<h1>Hello world<h1>")})
