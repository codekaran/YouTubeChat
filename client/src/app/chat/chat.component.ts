import {
  Component, OnInit, HostListener, Inject, ViewChildren, ViewChild, AfterViewChecked,
  AfterViewInit, QueryList, ElementRef, EventEmitter, Output, Optional,Input, style
} from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem, MatCard, MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from '../app.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Action } from './shared/model/action';
import { Status } from './shared/model/status';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { Room } from './shared/model/room';
import { SocketService } from './shared/services/socket.service';
import { DialogLoginComponent } from './dialog-login/dialog-login.component';
import { DialogLoginType } from './dialog-login/dialog-login-type';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { ScrollEvent } from 'ngx-scroll-event';
import { DOCUMENT } from '@angular/platform-browser';
import { Element } from '@angular/compiler';
import { EmojiPickerModule } from 'ng-emoji-picker';

@Component({
  selector: 'tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, AfterViewInit {
 
  onlineStatus: string;
  action = Action;
  status: Status;
  user: User;
  room: Room;
  groupChat: Boolean = true;
  personalChat: Boolean = false;
  personalChatArray: Array<{room:string,message:any[]}> = [];
  unreadMessageCount:Array<{count:number,room:string}>=[];
  personalRooms:any[]=[];
  recieverPersonalChat:boolean=false;
  // personalChatArray:any=[];
  usersEmail:string;
  offlineUsers:any=[];
  personalMessages: Message[] = [];
  messages: Message[] = [];
  oldChats: any = [];
  messageContent: string;
  onlineUsers: any = [];
  roomJoinStatus = [];
  roomLeavedStatus = [];
  usersImageArray = [];
  ioConnection: any;
  dialogRef: MatDialogRef<DialogLoginComponent> | null;
  dialogUserRef: MatDialogRef<DialogUserComponent> | null;
  loadCounter: number = 0;
  reciever: string= "";
  showPage: boolean;
  sender: string = "";
 
  numberOfUsersToFetch: number = 20;
  numberOfChatsToFetch: number = 10;
 
  senderSideChatButtonNames:any=[];
  chatBoxArray:any=[];
  innerHeight:number;
  innerWidth:number;
 
  chatBoxCount:number=0;
  leftPosition:number=0;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogLoginType.NEW
    }
  };

  @ViewChild(MatCard, { read: ElementRef }) matList: ElementRef;
  @ViewChild(MatList, { read: ElementRef }) matCard: ElementRef;
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;
  @ViewChild('chat-list') chatList;

  // @Output() UserData: EventEmitter<string> = new EventEmitter<string>();

  constructor(private socketService: SocketService,
    public dialog: MatDialog,
    private appService: AppService,
    @Inject(DOCUMENT) private document: Document,
   
  ) { }

  //######################## personal Chat #####################################

 



 
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = event.target.innerHeight;
    this.innerWidth = event.target.innerWidth;
   
  }
  


    public chatBoxPopup(headerName): void {
      var index = this.personalRooms.map(function(e: any) { return e.messageTo; }).indexOf(headerName);
      let room = this.personalRooms[index].room;
      
      var myIndex = this.unreadMessageCount.map(function(e: any) { return e.room; }).indexOf(room);

      if(myIndex>=0){
        this.unreadMessageCount[myIndex].count=0;
      }
      var buttonIndex = this.senderSideChatButtonNames.map(function(e: any) { return e.userTo; }).indexOf(headerName);
      if(buttonIndex>=0){
        this.senderSideChatButtonNames[buttonIndex].buttonStatus = true;
      }
      let onScreenChatBoxes : number; 

      onScreenChatBoxes = Math.round(innerWidth/200);
    
      if(this.chatBoxCount==0 || this.chatBoxCount >= onScreenChatBoxes){
        this.leftPosition = 0;
        this.chatBoxCount=0;
      }
      else if(this.chatBoxCount < onScreenChatBoxes){
        this.leftPosition = this.leftPosition+200;
      }
      
      this.chatBoxCount=this.chatBoxCount+1;
      
      console.log("inserting room "+room);
      this.chatBoxArray.push({name:headerName,position:this.leftPosition,room:room});
      console.log(this.chatBoxArray);
     
    }

    closeChatBox(headerName){
      var index = this.chatBoxArray.map(function(e: any) { return e.name; }).indexOf(headerName);
      this.chatBoxArray.splice(index,1);
      this.chatBoxCount--;
      this.leftPosition = this.leftPosition-200;
      var buttonIndex = this.senderSideChatButtonNames.map(function(e: any) { return e.userTo; }).indexOf(headerName);
      if(buttonIndex>=0){
        this.senderSideChatButtonNames[buttonIndex].buttonStatus = false;
        this.senderSideChatButtonNames.splice(buttonIndex,1);
      }
    }


  startPersonalChat(email,userTo,online) {//as sender
   console.log('inside start personal chat');
   
   
    var index = this.onlineUsers.map(function(e: any) { return e.name; }).indexOf(this.user.name);
  
   
console.log(this.onlineUsers[index]);
var senderEmail = this.onlineUsers[index].email;
var rm;
if(email>senderEmail)
  {
    rm = senderEmail+"-"+email;
  } 
  else{
    rm = email+"-"+senderEmail;
  }
  console.log(rm);
  var myIndex = this.senderSideChatButtonNames.map(function(e: any) { return e.userTo; }).indexOf(userTo);
  if(myIndex<0){
  this.senderSideChatButtonNames.push({userTo:userTo,buttonStatus:false,room:rm});
  }

  this.personalRooms.push({room:rm,messageTo:userTo});
   this.personalChat = true;
   this.recieverPersonalChat = false;
   var userFrom = this.user.name;
   this.reciever = userTo;
   
   this.socketService.joinPersonalChatRoom(userTo, userFrom,rm,online);
  }

  ngOnInit(): void {
    this.scrollToBottom();
    this.numberOfChatsToFetch = 10;
    setTimeout(() => {
      this.openLoginPopup(this.defaultDialogUserParams);
    }, 0);
    this.innerHeight=window.innerHeight;
    this.innerWidth=window.innerWidth;
  
  }

  @HostListener("scroll", ['$event'])
  onScroll(event) {
    let number = event.target.scrollTop;
    if (number < 5) {
      this.socketService.onGetMessageFromDb(this.getVideoId(), this.numberOfChatsToFetch * this.loadCounter, this.numberOfChatsToFetch);
      this.loadCounter++;
    }
  }

  ngAfterViewInit(): void {
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) { }
  }

  private initModel(userInfo): void {
    this.user = {
      id: userInfo.id,
      name: userInfo.name,
      image: userInfo.image,
    };
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onUpdateChat()
      .subscribe((message: Message) => {
        this.messages.push(message);
        // console.log("mesage in group");
        // console.log(message);
        this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight - 8;
    });
   
    this.ioConnection = this.socketService.onPersonalUpdateChat()
    .subscribe((messages: any) => {
      this.personalChat = false;
      
      this.sender = messages.from.name;
      this.recieverPersonalChat = true;
      this.groupChat = false;
      let room = messages.room;
      

      this.personalMessages.push(messages);
      // console.log("personal chat " + this.personalChat);
      // console.log("receiver chat " + this.recieverPersonalChat);
      //console.log(this.personalMessages);
       var obj = {
          "room" : room,
          "message": [messages]
       }
      
      var index = this.personalChatArray.map(function(e: any) { return e.room; }).indexOf(room);
     

      if(index<0){
      
        this.personalChatArray.push(obj);
        
      }
       else{
                
        this.personalChatArray[index].message.push(messages);
       }

      //  var chatView = document.getElementById('personalChatView');
      //  chatView.scrollTop = chatView.scrollHeight - chatView.clientHeight;

       //############ unread message  ####################


       console.log("unread message");
        console.log("searching for room"+room);
        var boxIndex = this.chatBoxArray.map(function(e: any) { return e.room; }).indexOf(room);

       if(boxIndex<0){
         console.log("box not found");
        var myIndex = this.unreadMessageCount.map(function(e: any) { return e.room; }).indexOf(room);
       if(myIndex<0){
         this.unreadMessageCount.push({"count":1,"room":room});
       }
       else{
         this.unreadMessageCount[myIndex].count=this.unreadMessageCount[myIndex].count+1;
         
         console.log(this.unreadMessageCount[myIndex].count);
       }
       }
       else{
         console.log("box found");
        var myIndex = this.unreadMessageCount.map(function(e: any) { return e.room; }).indexOf(room);
        if(myIndex<0){
          this.unreadMessageCount.push({"count":0,"room":room});
        }
        else{
          this.unreadMessageCount[myIndex].count=0;
          
          
        }

       }

       console.log(this.unreadMessageCount);

     // console.log(this.personalChatArray);
      
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight - 8;
    });


    this.ioConnection = this.socketService.fetchOldChat()
      .subscribe((fetchedChats: any) => {
        var tempMsg: Message = {};
        var tempHeight = this.matCard.nativeElement.scrollHeight;
        fetchedChats.forEach(element => {
          tempMsg = {};
          tempMsg.from = {
            id: element.id,
            image: element.image,
            name: element.userName
          };
          tempMsg.content = element.message;
          tempMsg.time = this.convertEpochToSpecificTimezone((new Date()).getTimezoneOffset(), element.time);
          this.messages.unshift(tempMsg);
        });

        if (this.loadCounter == 0) {
          this.scrollToBottom();
          this.loadCounter = 1;
        } else {
        }
        this.oldChats.push(tempMsg);
      });
      //############## fetching old personal chats ######################

      this.ioConnection = this.socketService.fetchOldPersonalChat()
        .subscribe((data:any)=>{
          console.log("the old personal data");
          var index;
          for(let value of data.data){


            var from={
              "name": value.userName,
              "id" : value.id,
              "image":value.image
            }
            var message={
              "content" : value.message,
              "from"  : from,
              "room" : data.room,
              "time" : value.time
            }
          
             index = this.personalChatArray.map(function(e: any) { return e.room; }).indexOf(data.room);
            if(index>=0){
              this.personalChatArray[index].message.push(message);
            }
            else{
              var obj={
                "room":data.room,
                "message":[message]
              };
              this.personalChatArray.push(obj);
            }

          }
          this.personalChatArray[index].message.reverse();

        });

    this.ioConnection = this.socketService.showOnlineUsers()
      .subscribe((data) => {
        
        
        console.log(data.online);
        console.log(data.offline);
            this.onlineUsers = data.online;
            this.offlineUsers = data.offline;
      });
//############ reciever joins here ####################
      this.ioConnection = this.socketService.onRequestReceiver()
      .subscribe((data: any) => {
        
        
        this.recieverPersonalChat = true;
        this.personalChat = false;
        var myIndex = this.senderSideChatButtonNames.map(function(e: any) { return e.userTo; }).indexOf(data.senderName);
        if(myIndex<0){
        this.senderSideChatButtonNames.push({userTo:data.senderName,buttonStatus:false,room:data.roomName});
        }
        console.log('reciever joined');
    
        
        this.personalRooms.push({room:data.roomName,messageTo:data.senderName});
       this.socketService.receiverAcceptRequest(data.roomName);
       this.socketService.loadOldPersonalChats(data.roomName);

      });

    this.ioConnection = this.socketService.onUpdateRoomStatus()
      .subscribe((status: any) => {
        if (status.action == "JOINED") {
          this.messages.push(status);
        }
        else if (status.action == "LEFT") {
          this.messages.push(status);
        }
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });


    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }



  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  public onClickUserInfo() {
    this.openLoginPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: DialogLoginType.EDIT
      }
    });
  }

  public convertEpochToSpecificTimezone(offset, millisecond) {
    var d = new Date(millisecond);
    var nd = new Date(millisecond);
    return nd.toLocaleString();
  }

  public openUserPopup(): void {
    this.dialogUserRef = this.dialog.open(DialogUserComponent, {
      height: '350px',
      width: '500px',
    });
  }



  private openLoginPopup(params): void {
    this.dialogRef = this.dialog.open(DialogLoginComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }
      this.initIoConnection();
      var userData = {
        "email": paramsDialog.email,
        "name": paramsDialog.username,
        "image": paramsDialog.image,
        "id": paramsDialog.id,
        "provider": paramsDialog.provider
      }
     this.usersEmail = userData.email;
      console.log(this.usersEmail);

      this.socketService.saveUsers(userData);
      this.initModel(userData);
    });
  }

  public sendNotification(params: any, action: Action): void {
    let message: Message;
    var user = this.user.name;
    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action: action
      }
    }

    else if (action === Action.LEFT) {
      message = {
        action: action,
        content: {
          from: this.user.name,
          action: action
        }
      };
    }

    else if (action === Action.RENAME) {
      message = {
        action: action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername
        }
      };
    }
    
  }

  public showtime() {
    var timeNow = new Date();
    var hours = timeNow.getHours();
    var minutes = timeNow.getMinutes();
    var seconds = timeNow.getSeconds();
    var timeString = "" + ((hours > 12) ? hours - 12 : hours);
    timeString += ((minutes < 10) ? ":0" : ":") + minutes;
    timeString += ((seconds < 10) ? ":0" : ":") + seconds;
    timeString += (hours >= 12) ? " pm" : " am";
    return timeString;
  }

  public sendMessage(message: string): void {
    
    if(message!=null){
    console.log("inside send message");
    if (!message) {
      return;
    }
    var roomName = this.videoData["title"];
    var time = this.showtime();
    this.socketService.showGroupChat({    //done
      from: this.user,
      content: message,
      time: time
    });
   
    this.messageContent = null;
  }}


//sender side sending message


  public sendPersonalMessage(message: string,name:string): void {
    console.log("sending personal message to "+name);
    console.log(this.personalRooms);
    var index = this.personalRooms.map(function(e: any) { return e.messageTo; }).indexOf(name);
   
   var roomToSend = this.personalRooms[index].room;
console.log('roomToSend'+roomToSend);
    var time = this.showtime();
    this.socketService.showPersonalChat({
      from: this.user,
      content: message,
      time: time,
      room:roomToSend
    });
  
  }

  roomsId = [];
  roomUsers = [];

  public createRoom(): void {
    var room: Room;
    var roomName = this.videoData["title"];
    var roomId = this.getVideoId();
    var userName = this.user.name;
    room = {
      id: roomId,
      name: roomName,
      userName: userName
    }

    if (this.roomUsers.includes(userName)) {
      this.socketService.switchRoom(room);
    }
    else if (this.roomsId.includes(room.id) == false) {
      this.socketService.updateRoom(room);
    }
    this.socketService.showRoom(room);
    this.socketService.showUsers(room,this.usersEmail);//here
    this.roomsId.push(roomId);
    this.roomUsers.push(userName);
  }





  @ViewChild('f') getVideosForm: NgForm;
  submitted = false;
  videoCridentials = {
    url: 'https://www.youtube.com/embed/VXKBUZnLWN0'
  }

  videoData = {};

  getVideos() {
    this.submitted = true;
    this.messages = [];
    this.videoCridentials.url = this.getVideosForm.value.url;
    this.videoCridentials.url = this.videoCridentials.url.replace("watch?v=", "embed/");
    this.showData();
    this.createRoom();
    this.loadCounter = 0;
  
    this.socketService.onGetMessageFromDb(this.getVideoId(), 0, this.numberOfChatsToFetch);
  }

  getVideoId() {
    // var videoId = this.videoCridentials.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    var videoId = this.videoCridentials.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)([^\s&]+)/);
    if (videoId != null) {
      var id = videoId[1].replace('/embed/', '');
    } else {
      console.log("The youtube url is not valid.");
    }
    return id;
  }

  showData() {
    this.appService.getData(this.getVideoId())
      .subscribe(
        (response) => {
          var viewsCount = response["viewsCount"];
          var likeCount = response["likeCount"];
          var dislikeCount = response["dislikeCount"];
          var favoriteCount = response["favoriteCount"];
          var publishedAt = response["publishedAt"];
          var caption = response["caption"];
          var channelId = response["channelId"];
          var channelTitle = response["channelTitle"];
          var description = response["description"];
          var title = response["title"];
          var duration = response["duration"];
          var caption = response["caption"];
          var tags = response["tags"];

          this.videoData = {
            "viewsCount": viewsCount,
            "likeCount": likeCount || "",
            "dislikeCount": dislikeCount || "",
            "favoriteCount": favoriteCount || "",
            "publishedAt": publishedAt || "",
            "channelId": channelId || "",
            "channelTitle": channelTitle || "",
            "description": description || "",
            "title": title || "",
            "duration": duration || "",
            "caption": caption || "",
            "tag": tags || ""
          }
        },
        (error) => console.log(error)
      );
  }
}

