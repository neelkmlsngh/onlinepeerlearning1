import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { config } from './../config/config';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestOptions, Request, RequestMethod, Headers } from '@angular/http';

@Injectable()
export class AuthenticationService {
  // config = config;
  constructor(private http: Http, private router: Router) {}

user:any
// variable to hold github personal access token
public pacToken:String;


  setUserInfo(obj) {
     this.user=obj;

   
     localStorage.setItem('currentUser', JSON.stringify({ token: this.user.token, userId: this.user.userId,userName:this.user.userName }));
    if (this.user.token) {
      this.router.navigate(["/main"]);

    } else if (!this.user.token) {
      this.router.navigate(["/"])

    }
  }

  getToken(): any {
    let userDetails = JSON.parse(localStorage.getItem('currentUser'));
    let token=userDetails.token;
console.log('token',token)
    return token;
  }

 getUserId(): any {
    return JSON.parse(localStorage.getItem('currentUser'))['userId'];
  }

  logoutEditor(user) {
   
     localStorage.removeItem('currentUser');
     return this.http
      .put(config.connect.apiURL +'/api/login/logout',user)
      .map(res => res.json(), error => error.json());
    }

  private authoriZation() {
    let token = this.getToken()
    if (token) {
      let headers = new Headers({ 'Authorization': token });
      return new RequestOptions({ headers: headers });
    }
  }

  getUser(userId){
 return this.http.get(config.connect.apiURL +'/api/login/'+userId)
      .map(res => res.json(), error => error.json());
   
  }

// service method to get github personal access token of user using userid
  getPersonalAccessToken(userId) {
    const api = config.connect.apiURL + "/api/users/" + userId
    return this.http
      .get(api)
      .map(res => res.json(), error => error.json());
  }

  //function to add personal access token in request header for github api
  addPersonalAccessToken() {
    console.log("inside addPersonalAccessToken")
    let headers = new Headers({ 'Authorization': "Basic " + this.pacToken });
    return new RequestOptions({ headers: headers });
  }

}
