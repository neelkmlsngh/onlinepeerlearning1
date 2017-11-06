import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { config } from '../config/config';

import {SocketService} from './chatservices/socket.service'

@Injectable()
export class ProfileService {
  config = config;

  constructor(private http: Http,private socketService:SocketService) {}

  // service method to get data of user using userid
  getDataFromDB(userId) {
    //url to get details from db
    const api = config.connect.apiURL+ "/api/users/" + userId
    return this.http
      .get(api)
      .map(res => res.json(), error => error.json());
  }

  // service method to upload image
  uploadFile(userId, formData, options) {
    // url to upload profile picture
    const api = config.connect.apiURL + "/api/users/image/" + userId
    return this.http.put(api, formData, options)
      .map(res => res.json(), error => error.json());

  }

  uploadChatFile(formData, options) {
  /* let fileObj={
>>>>>>> 160bf878047e4d5dcb20983edeaf0bfe1ff1a904

   uploadChatFile(formData, options) {}

/*  uploadChatFile(formData, options) {
   let fileObj={
>>>>>>> b2ad568e214fd3dfa2c19c68906ac65635f02c48
      "formData": formData,
      "options": options
    }
    this.socketService.sendFile(fileObj)
    let observable = new Observable(observer => {
      this.socket.on('chat-list-response', (data) => {
        console.log(JSON.stringify(data, null, 2));
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
<<<<<<< HEAD
  }*/
}
  //method store token into database
  storeAccessToken(userId,token){
    const api = config.connect.apiURL+"/api/users/token/"+userId
    return this.http.put(api,token)
    .map(res=>res.json(),error=>error.json());
  }

}
