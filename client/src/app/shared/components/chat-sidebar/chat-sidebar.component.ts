import { Component, OnInit, OnDestroy, NgZone, AfterViewInit,  TemplateRef} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import * as $ from 'jquery';

import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css'],
  providers: [ChatService]
})
export class ChatSidebarComponent implements OnInit, OnDestroy, AfterViewInit {
  connection;
  users:any;
  chat: any = null;
  windowRef:any;
  methodToExport:any;
  link:string='';
  public modalRef: BsModalRef;

  constructor(private chatService: ChatService, private zone: NgZone, private modalService:BsModalService) {
    this.methodToExport=this.calledFromOutside;
    window['angularComponentRef'] = {component: this, zone: zone};
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  
calledFromOutside(url:string) {
    this.zone.run(() => {
      this.link=url;
    });
  }

  ngOnInit() {
    debugger
     this.connection = this.chatService.getOnlineUsers().subscribe(user => {
      this.users=user;
      
    }) 
   /*$(document).ready(function(){
        $('.togetherjs-dock-right').hide();
    });*/


  }
  ngAfterViewInit() {
   console.log($('.togetherjs-dock-right'))
    $('#togetherjs-dock').hide();
  }

  /*screenShare(call) {
     this.windowRef= window;
     if (this.windowRef.TogetherJS) {
         this.windowRef.TogetherJS();

         setTimeout(function(){
                $('.togetherjs-dock-right').remove();
                this.screenSharingLink=$('.togetherjs-share-link').val();
                console.log("=======11111",this.screenSharingLink);
                $('#togetherjs-share').remove();
                $('#togetherjs-window-pointer-right').remove();
            },100)
     }
}*/
sh(){
  $('#textbx').toggle();
}

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
 username(name){
 this.chat=name;
 
 var $chatbox = $('.chatbox');

  $chatbox.toggleClass('chatbox--tray');
   $chatbox.removeClass('chatbox--tray')
 setTimeout(()=>{
$('.chatbox').removeClass('chatbox--tray')
 },500);
 
   }
}
