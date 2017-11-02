import { Component, OnInit,TemplateRef } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import * as $ from 'jquery';
import {AuthenticationService} from './../../../services/authentication.service';

/* Importing services starts*/
import { SocketService } from './../socket.service';
import { HttpService } from './../http.service';
import { ChatService } from './../chat.service';

@Component({
  selector: 'app-chat-home',
  templateUrl: './chat-home.component.html',
  styleUrls: ['./chat-home.component.css'],
  providers : [ChatService,HttpService,SocketService]
})
export class ChatHomeComponent implements OnInit{

 /*
	* UI related variables starts
	*/
 public modalRef: BsModalRef;
	 overlayDisplay = false;
	 selectedUserId = null;
	 selectedSocketId = null;
	 selectedUserName = null;   
	/* 
	* UI related variables ends
	*/
	/*
	* Chat and message related variables starts
	*/
	// username = null;
	 userId = null;
	 socketId = null;
	 chatListUsers = [];
	 message = '';
	 messages = [];
	 data2:any=[];		
	/*
	* Chat and message related variables ends
	*/
	constructor( 
		private chatService : ChatService,
		private socketService : SocketService,
		private route :ActivatedRoute,
		private router :Router,
		private modalService: BsModalService,
		private authenticationService :AuthenticationService
	) { }
	ngOnInit() {
	$('.chatbox').hide();	
	this.userId=this.authenticationService.getUserId();
		/*
		* getting userID from URL using 'route.snapshot'
		*/      
	//	this.userId = this.route.snapshot.params['userid'];
		if(this.userId === '' || typeof this.userId == 'undefined') {

			this.router.navigate(['/']);
		}else{
			/*
			* function to check if user is logged in or not starts
			*/ 
		
			this.chatService.userSessionCheck(this.userId,( error, response )=>{
				if(error) {
					this.router.navigate(['/']); /* Home page redirection */
				}else{
					//console.log(JSON.stringify(response));
				//	this.username = response.username;
					this.overlayDisplay = true;
					/*
					* making socket connection by passing UserId.
					*/  
					this.socketService.connectSocket(this.userId);
					/*
					* calling method of service to get the chat list.
					*/  
					this.socketService.getChatList(this.userId).subscribe(response => {
						
						if(!response.error) {
							
							if(response.singleUser) {
								/* 
								* Removing duplicate user from chat list array.
								*/
								if(this.chatListUsers.length > 0) {
									this.chatListUsers = this.chatListUsers.filter(function( obj ) {
										return obj._id !== response.chatList._id;
									});
								}
								/* 
								* Adding new online user into chat list array
								*/
								this.chatListUsers.push(response.chatList);
							}else if(response.userDisconnected){
								this.chatListUsers = this.chatListUsers.filter(function( obj ) {
									return obj.socketId !== response.socketId;
								});
							}else{
								/* 
								* Updating entire chatlist if user logs in.
								*/
								this.chatListUsers = response.chatList;
							}
						}else{
							alert(`Chat list failure.`);
						}
					});
					/* 
					* subscribing for messages statrts
					*/
					this.socketService.receiveMessages().subscribe(response => {
						//console.log(this.selectedUserId +" "+response.fromUserId)
						if(this.selectedUserId && this.selectedUserId == response.fromUserId) {
							this.messages.push(response);
							setTimeout( () =>{
									document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
							},100);
						}
					});
					/* 
					* subscribing for messages statrts
					*/
					
				}
			});
		}
	}													

	selectedUser(user):void{

        this.selectedUserId = user.userId;
        this.selectedSocketId = user.socketId;
        this.selectedUserName = user.userName;
//alert(this.selectedUserId);
        /* 
        * calling method to get the messages
        */
       
        this.chatService.getMessages({ userId : this.userId,toUserId :user.userId} , ( error , response)=>{
            if(!response.error) {
                this.messages = response.messages;
                
            }
        });
        this.openchatbox()
        this.hidechatbox()
    }


   openchatbox():void
    {
var $chatbox = $('.chatbox'),
            $chatboxTitle = $('.chatbox__title'),
            $chatboxTitleClose = $('.chatbox__title__close'),
            $chatboxTitleTray = $('.chatbox__title__tray'),
            $chatboxCredentials = $('.chatbox__credentials');
        
        $chatboxTitle.on('click', function() {
            $chatbox.toggleClass('chatbox--tray');
            
        });
        $chatboxTitleClose.on('click', function(e) {
            //e.stopPropagation();
            /*$chatbox.addClass('chatbox--closed');*/
            $chatbox.hide();
            
        });
        $chatbox.on('transitionend', function() {
            if ($chatbox.hasClass('chatbox--closed'))
             $chatbox.hide();
        });
        $chatboxCredentials.on('submit', function(e) {
            e.preventDefault();
            $chatbox.removeClass('chatbox--empty');
        });
        $('#myhead').on('click',function(){
            $chatbox.toggleClass('chatbox--tray');
        });
        $chatboxTitleTray.on('click',function(){
            $chatbox.toggleClass('chatbox--tray');
        });
    } 

    hidechatbox():void
  {
      $('.chatbox').show();
        $('.side').hide();
  }

    isUserSelected(userId:string):boolean{
        if(!this.selectedUserId) {
            return false;
        }
        return this.selectedUserId ===  userId ? true : false;
    }

    sendMessage(event){

    	   if(event.keyCode === 13) {
            if(this.message === '' || this.message === null) {
                alert(`Message can't be empty.`);
            }else{

                if (this.message === '') {
                    alert(`Message can't be empty.`);
                }else if(this.userId === ''){
                    this.router.navigate(['/']);                    
                }else if(this.selectedUserId === ''){
                    alert(`Select a user to chat.`);
                }else{
                				/*alert('fromUserId' +this.userId );
                        alert('message'  +this.message);
                        alert('toUserId '+this.selectedUserId);
                        alert('toSocketId ' +this.selectedSocketId);
                        alert('fromSocketId ' +this.socketId);*/
                        
                    let data:any = {
                        fromUserId : this.userId,
                        message : (this.message).trim(),
                        toUserId : this.selectedUserId,
                        toSocketId : this.selectedSocketId,
                        fromSocketId : this.socketId
                    }
                    

										this.messages.push(data);

                    // alert(JSON.stringify(this.messages[0]))
                    setTimeout( () =>{
                            document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
                    },100);
                    
                    /* 
                    * calling method to send the messages
                    */
                    this.message = null;
                    this.socketService.sendMessage(data);
                }
            }
        }
    }

    alignMessage(userId){
        return this.userId ===  userId ? false : true;
    }

    removesb(){
       $('.side').toggle();
       
}

audiocall(template1: TemplateRef<any>)
{
	this.modalRef = this.modalService.show(template1);
 
}

videocall(template2: TemplateRef<any>)
{
	this.modalRef = this.modalService.show(template2);
 
}
}