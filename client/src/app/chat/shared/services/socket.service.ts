import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../model/message';
import { Room } from '../model/room';
import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';
@Injectable()
export class SocketService {
    public socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL); 
    }

    

    public showRoom(room: Room): void {
        this.socket.emit('create', room);
    }

    public showUsers(room:Room,email:string): void{
        this.socket.emit('adduser', room.userName, room.id,email);
    }

    public updateRoom(room: Room): void {
        this.socket.emit('updateRoom', room); 
    }

    public showGroupChat(data: Message): void {
        console.log("group chat data");
       
        this.socket.emit('onChat', data);
    }

    public showPersonalChat(data: any): void {
        this.socket.emit('onPersonalChat', data); 
    }

    public switchRoom(room: Room): void{
        this.socket.emit('switchRoom', room);
    }

    public onUpdateChat(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('updateChat', (data: Message) => {observer.next(data)
                console.log("message");
                // console.log(data);
        });
            
        });
    }  

    public onPersonalUpdateChat(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('personalUpdateChat', (data: any) => observer.next(data));
        });
    } 

    public onUpdateRoomStatus(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('updateRoomStatus', (data: any) =>
                observer.next(data));
        });
    } 

    public onGetMessageFromDb(roomId: string, skipValue: number, limitValue: number):void {
        this.socket.emit('getRoomMessagesFromDb', roomId, skipValue, limitValue);
    }  
    
    public fetchOldChat(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('oldChats', (data: any) => observer.next(data));
        });
    } 
    
    public saveUsers(data: any): void {
        console.log("inside save users");
        this.socket.emit('saveUserInDb', data);
    }

    public showOnlineUsers(): Observable<any> {
        return new Observable<any>(observer => {
        this.socket.on('onlineUsersdata', (data: any) =>  {observer.next(data);
        console.log("user deleted");
        })
        });
    }

    public joinPersonalChatRoom(userTo: string, userFrom: string,room:string,online:boolean): void {
       this.socket.emit('privateRoomJoin', userTo, userFrom,room,online)//change
    }

    public onRequestReceiver(): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on('requestReceiver', (data: any) => observer.next(data));
        });
    }


    public loadOldPersonalChats(room:string){
        console.log('loading personal chats');
        this.socket.emit('getPersonalRoomMessagesFromDb',room,0,10);
    }

    public fetchOldPersonalChat(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('oldPersonalChats', (data: any) => observer.next(data));
        });
    } 

    public receiverAcceptRequest(room: string): void {
        this.socket.emit('receiverJoined', room);
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
    
    

}

