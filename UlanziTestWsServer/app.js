/**
 * Created by huanghy 
 */
var http = require('http');
var ws = require('ws');

var express = require('express');
var app = express();


//创建http的服务
var server = http.createServer(app);

//设置静态文件目录
app.use(express.static(__dirname+'/public'));

//创建一个websocket的服务
var wsServer = new ws.Server({server:server});

//该对象用于保存连接上来的客户端
var rooms = {};


wsServer.on('connection',function (ws,msg) {

    //当有客户端连接上服务器，将会进到connection
    console.log('=======connection========');


    //say hello
    ws.send(JSON.stringify({code:0}),function (err) {
        if(err){
            console.log('send notify error');
        }
    });

    var roomid = msg.url.split('/');
    var len = roomid.length-1;
    roomid = roomid[len];
    if(roomid == ''){
        roomid = 'client';
    }

    //判断rooms里是否含有刚连接上来的roomid，如果没有，则将会创建一个空数组（当作房间），用于后续保存同一个roomid的不同客户端；如果有，此处将不创建，后续将该客户端存入原来的数组即可
    if(!rooms[roomid]){
        rooms[roomid] = [];
        console.log('===room create:',roomid);
    }


    ws.on('message',function (msg) {
        //当客户端发送消息时，将会进到message
        console.log('=======message========');
        // console.log(msg);
        let sendid = 'client';
        rooms[sendid] && rooms[sendid].length > 0 && rooms[sendid].forEach(function (c) {
            if(c != ws){
                c.send((msg).toString());
            }
            
        })

    })


    //将客户端保存到同一房间里
    rooms[roomid].push(ws);
    



    ws.on('close',function () {
        console.log('=====close client');
        //每个客户端断开连接都会进到close

        //拿到该房间所有客户端
        var clients = rooms[roomid];

        //匹配当前客户端位于房间的哪个位置
        var index = clients.indexOf(ws);

        //若index!=-1表示找到，房间数组clients将剪掉该房间
        if(index!=-1){
            clients.splice(index,1);
        }

        //若房间数组clients的长度为0，则表示刚房间没有客户端，将删除该房间
        if(clients.length==0) {
            // console.log('room destroy:',roomid);
            delete rooms[roomid];
        }

    });
});


server.listen(3906,()=>{
    console.log('server started and run http://localhost:3906');
});//服务的端口号为3906