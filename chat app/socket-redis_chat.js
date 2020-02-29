const app = require('express')();
const redis = require('redis')
var http = require('http').Server(app);
var io = require('socket.io')(http);

const client = redis.createClient(6379)

app.get('/', function(req, res) {
   res.sendfile('chat-client.html');
});

users = []; 
io.on('connection', function(socket) {
   console.log('A user connected');
   socket.on('setUsername', function(data) {
      console.log(data);
      
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
         socket.emit('userSet', {username: data});
         if (client.get('framework')) {
         client.get('framework', (err, members) => {
            if (err) throw err;
            console.log("1st" + data);
            console.log("2" + JSON.stringify(data));
            console.log("3" + members);
            console.log("4" + JSON.parse(members));
            console.log("pwpwpw");
            //data = JSON.parse(data).concat(JSON.parse(members));
            console.log('###' + JSON.stringify(data));
          });}
         //client.set('framework', JSON.stringify(data), redis.print);
    }
   });
 
   
   socket.on('msg', function(data) {
       var master = []
    console.log(data);
    io.emit('newmsg', data);
    if(client.get('framework')) {
    client.get('framework', (err, members) => {
        if (err) throw err;
        if (members !== null) { 
             newdata = members.split(",");
             newdata = newdata + "," + data.message;
            client.set('framework', JSON.stringify(newdata), redis.print);
        } else {
            console.log(typeof data);
            console.log(data.message);
            var test = []
            test.push(data.user)
            test.push(data.message)
            client.set('framework', '"'+test.join(",")+'"', redis.print);
        }
        
        console.log('@@@' + data);
      });
    }
    // console.log('@@#$' + JSON.stringify(data));
    // client.set('framework', JSON.stringify(data), redis.print);
    //     io.emit('newmsg', data);
   })

   socket.on('getCache', function() { 
    client.get('framework', (err, members) => {
        if (err) throw err;
        socket.emit('getCache', members);
        console.log("-------------------------------",members);
      });
   });
});  

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});