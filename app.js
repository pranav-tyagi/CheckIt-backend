const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const Emitter = require('events');

app.use(cors());

app.use(express.json());

// app.get('/',(req,res) => {
//     console.log('the request is getting to the backend');
//     res.send('Server is sending the response');
// })
// const eventEmitter = new Emitter();
// app.set('eventEmitter',eventEmitter);

app.use('/',require('./controllers/BusinessRoutes'));

app.use('/user',require('./controllers/UserRoutes'));

app.use((res,req,next)=>{
    res.send('U type something wrong');
})

const server = app.listen(PORT,'0.0.0.0',()=>{
    console.log('Connected to Port ',PORT);
})
// console.log(server);
// const io = require('socket.io')(server,{
//     origins: ["https://localhost:4200"],

//   // optional, useful for custom headers
//   handlePreflightRequest: (req, res) => {
//     res.writeHead(200, {
//       "Access-Control-Allow-Origin": "https://localhost:4200",
//       "Access-Control-Allow-Methods": "GET,POST",
//       "Access-Control-Allow-Headers": "my-custom-header",
//       "Access-Control-Allow-Credentials": true
//     });
//     res.end();
//   }
// });

// io.on('connection', (socket) => {
//     console.log(socket.id);
    // socket.emit('hello', {msg : "Hello from backend"});
    // socket.on('join',(orderId) => {
    //     console.log(orderId);
    // })
// })

// eventEmitter.on('orderUpdated', (data) => {
//     console.log('Order updated successfully ',data);
// })

// eventEmitter.on('newOrder',(data) => {
//     console.log("The new order placed is ",data);
// })