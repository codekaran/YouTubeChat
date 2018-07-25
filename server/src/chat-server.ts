import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as mongoose from 'mongoose';
import { Message } from './model';
import { Room } from './model';
import { IRoomModel } from './database/dbLogic/model/interfaces/RoomModel';
import { RoomBusiness } from './database/dbLogic/business/RoomBusiness';
import { UserBusiness } from './database/dbLogic/business/UserBusiness';
import { OnlineUsersRepository } from './database/dbLogic/repository/OnlineUsersRepository';
import { userInfo } from 'os';

export class ChatServer {

    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: socketIo.Server;
    private port: string | number;
    
    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets(); this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen() {

        var IO = this.io;
        var roomBusinessObj = new RoomBusiness();
        var userBusinessObj = new UserBusiness();

        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
            var rooms: any = [];
            var currentRoom: any = "";
            var roomId = "";
            var userNames: any = [];
            var offlineRoomUsers:any =[];
            var onlineRoomUsers: any = [];         //name ,,room name,,,,socket ID.
            var onlineUsers:any =[];              //name,, room name.
            var offlneUsers:any =[];
            var personalRoom: string = "";

// ******************** connecting socket ***************************************************************            

            IO.sockets.on('connection', function (socket: any) {

                console.log("inside on first connection");

            // ############################## group chat ################################# 

               //creating room

                socket.on('create', (room: any) => {

                    this.roomId = room.id;
                    if (rooms.indexOf(this.roomId) == -1) {
                        rooms.push(room.id);
                    }
                });

                // joining user in the room

                socket.on('adduser', (userName: any, room: any,email:string) => {
                    console.log('A New User Added: %s', JSON.stringify(userName));
                    socket.join(room, function (err: any) {
                        if (err) {
                            console.log(err);
                        } else {

                            var onlineUsersdata ={
                                "userName": userName,
                                "roomJoined": room,
                                "socketId": socket.id
                            }


                            onlineRoomUsers.push(onlineUsersdata);
                            //offlineRoomUse
                            
                            //############## original array of users to be fetched #################
                            
                            var userData={

                                "userInfo":[{"name":userName,"email":email}],
                                "room":room,
                              
                            }
                          
                            var index = onlineUsers.map(function(e: any) { return e.room; }).indexOf(room);
                            if(index<0){
                                onlineUsers.push(userData);
                              
                                
                            }
                            else{
                           
                                onlineUsers[index].userInfo.push({"name":userName,"email":email});
                              
                            }
                            console.log("online users")
                            console.log(onlineUsers);
                           

                            
                            var offlineIndex = offlneUsers.map(function(e: any) { return e.room; }).indexOf(room);
                            if(offlineIndex>=0){
                                //var nameIndex = offlneUsers[offlineIndex].name.indexOf(userName);
                                var emailIndex = offlneUsers[offlineIndex].userInfo.map(function(e: any) { return e.email; }).indexOf(email);
                                console.log(offlneUsers[offlineIndex].userInfo[emailIndex]);
                                if(emailIndex>=0)
                                    offlneUsers[offlineIndex].userInfo.splice(emailIndex,1);
                                    console.log('offline users');
                                    console.log(offlneUsers);
                            }
                            updateUsers(room);

                            var action1 = "JOINED";
                            IO.sockets.in(room).emit('updateRoomStatus', action1);

                            // group chat

                            socket.on('onChat', (messageData: any) => {
                                console.log(messageData);
                                console.log("The message is :");
                                var from = messageData.from;
                                var content = messageData.content;
                                var time = Date.now();
                                var data = {
                                     "from": from,
                                     "content": content,
                                     "time": time,
                                }

                            // update chat
                           
                            // console.log(data);

                                IO.sockets.in(room).emit('updateChat', (data));

                                // saving room in db 

                                roomBusinessObj.createRoom(room, data.from.name, content, data.from.image, time).then((res: any) => {
                                    // console.log("#### room created in db ########");
                                    // console.log(res);
                                    (err: any) => {
                                        if (err) {
                                            console.log(err.message);
                                        }
                                    };
                                });
                            });

                            // switch room

                            socket.on('switchRoom', (newRoom: any) => {
                                socket.leave(room);
                                socket.join(newRoom);
                                var action2 = "LEFT";
                                IO.sockets.in(room).emit('updateRoomStatus', action2)
                                socket.emit('updateRooms', rooms, newRoom);
                            });
                        }
                    });
                });

                function updateUsers(room: any) {
                    var onlineindex = onlineUsers.map(function(e: any) { return e.room; }).indexOf(room);
                    var offlineindex = offlneUsers.map(function(e: any) { return e.room; }).indexOf(room);
                    var online=[];
                    var offline=[];
                    if(onlineindex>=0){
                        console.log('in update array');
                        //console.log(onlineUsers[onlineindex].userInfo);
                        online = onlineUsers[onlineindex].userInfo;
                    }
                    if(offlineindex>=0){
                        //offline = offlneUsers[offlineindex].name
                        offline = offlneUsers[offlineindex].userInfo;

                    }

                    IO.sockets.in(room).emit('onlineUsersdata',{online,offline});
                }

            //##################### Personal Chat ##################################

                // sender joined

                socket.on('privateRoomJoin', (userTo: string, userFrom: string,room:string,online:boolean) => {//change
                    var rm = room; //change
                   
                    // console.log("sender room " +personalRoom );
                    if(online){
                    var index = onlineRoomUsers.map(function(e: any) { return e.userName; }).indexOf(userTo);
                    var recieverSocketId = onlineRoomUsers[index].socketId;
                
                    var data={
                        "roomName":rm,
                        "senderName":userFrom
                    }
                    socket.broadcast.to(recieverSocketId).emit('requestReceiver', data);
                    socket.join(rm, function(err: any){
                        if(err){
                            console.log(err);
                        }
                            else{
                                console.log("sender joined the room");
                                console.log(rm)
                            }
                     });

                    }
                    else{

                    }
                 });

                // receiver joined
                
                socket.on('receiverJoined', (room: string) => {
                    // console.log("receiver room " + room);
                    socket.join(room, function(err: any){
                        if(err){
                            console.log(err);
                        }
                            else{
                                console.log( " receiver joined the room "+room);
                            }
                     });
                }); 

                socket.on('onPersonalChat', (messageData: any) => {
                    var from = messageData.from;
                    var content = messageData.content;
                    var time = Date.now();
                    var data = {
                         "from": from,
                         "content": content,
                         "time": time,
                         "room":messageData.room
                    }

                    console.log("the data to send "+data.content);

                // update chat
                        console.log("sending in room "+messageData.room);
                IO.sockets.in(messageData.room).emit('personalUpdateChat', (data));

                // saving room in db 

                    roomBusinessObj.createRoom(messageData.room, data.from.name, content, data.from.image, time).then((res: any) => {
                        // console.log("#### room created in db ########");
                        // console.log(res);
                        (err: any) => {
                            if (err) {
                                console.log(err.message);
                            }
                        };
                    });
                });
                
            //######################### database logic ###############################

                // fetching group chat from db

                socket.on('getRoomMessagesFromDb', (ID: string, skipValue: number, limitValue: number) => {
                    // console.log("fetching data from mongoDb");
                    roomBusinessObj.findRoom(ID, skipValue, limitValue).then((res: any) => {
                        // console.log('### Found Room ###');
                        // console.log(res);
                        IO.sockets.in(ID).emit('oldChats', res);
                    }, (err: any) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                });


                socket.on('getPersonalRoomMessagesFromDb', (ID: string, skipValue: number, limitValue: number) => {
                    // console.log("fetching data from mongoDb");
                    roomBusinessObj.findRoom(ID, skipValue, limitValue).then((res: any) => {
                         console.log('### Found Room ###'+ID);
                        console.log(res);
                        IO.sockets.in(ID).emit('oldPersonalChats', {data:res,room:ID});
                    }, (err: any) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                });

                // saving user in db

                socket.on('saveUserInDb', (data: any) => {
                    var email = data.email; 
                    var name = data.name;
                    var image = data.image;
                    var id = data.id;
                    var provider = data.provider;
                    userBusinessObj.addUserInDb(email, name, image, id, provider).then((res: any) => {
                        // console.log("#############user saved in db#####################")
                        // console.log(res);
                    }, (err: any) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                });
     

    // ******************** disconnecting socket *************************************************************** 

                socket.on('disconnect', function () {
                    console.log('user disconnected here');
                    var index = onlineRoomUsers.map(function(e: any) { return e.socketId; }).indexOf(socket.id);
                    // console.log("removed index " + index);
                    var roomJoined = onlineRoomUsers[index].roomJoined;
                    // console.log(roomJoined);
                    var userDisconnected = onlineRoomUsers[index].userName;
                    // updatePersonalChatArray(roomJoined,userDisconnected);
                    var disconnectedEmail;
                    var roomIndex = onlineUsers.map(function(e: any) { return e.room; }).indexOf(roomJoined);
                    if(index>=0){
                        var myIndex = onlineUsers[roomIndex].userInfo.map(function(e: any) { return e.name; }).indexOf(userDisconnected);

                        //var myIndex = onlineUsers[roomIndex].userInfo.indexOf(userDisconnected);
                        console.log(myIndex);

                        disconnectedEmail=onlineUsers[roomIndex].userInfo[myIndex].email;
                        
                        onlineUsers[roomIndex].userInfo.splice(myIndex,1);

                       
                    }
                    
                    console.log("online Users");
                    console.log(onlineUsers);

                    var usersData ={
                        "userInfo": [{"name":userDisconnected,"email":disconnectedEmail}],
                        "room": roomJoined,
        
                    }
                    var roomIndex = offlneUsers.map(function(e: any) { return e.room; }).indexOf(roomJoined);
                   if(roomIndex>=0){
                       offlneUsers[roomIndex].userInfo.push({"name":userDisconnected,"email":disconnectedEmail});
                   }
                   else{
                       offlneUsers.push(usersData);
                   }
                   


                    console.log("offline users");
                    console.log(offlneUsers);
                    console.log(userDisconnected+" disconnected ");


                    onlineRoomUsers.splice(index, 1);
                    updateUsers(roomJoined);
                });
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}



