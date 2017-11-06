import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { config } from '../config/config';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import * as $ from 'jquery';

@Injectable()
export class GitService {
  accessToken: any;
  userName: any;

  constructor(private _http: Http) {
    let userDetails = JSON.parse(localStorage.getItem('currentUser'));
    this.userName = userDetails.userName;
  }

  //method to get github userName
  getUser() {
    if (this.userName) {
      return this._http.get(config.giturls.HOSTURLUSERS + this.userName +
          '?client_id=' + config.connect.CLIENT_ID +
          '&client_secret=' + config.connect.CLIENT_SERVICE)
        .map(res => res.json())
        .catch(this.handleError);
    }
  }

  //method to get all the repositories of the user
  getRepos() {
    if (this.userName) {
      return this._http.get(config.giturls.HOSTURLUSERS + this.userName +
          '/repos?client_id=' + config.connect.CLIENT_ID +
          '&client_secret=' + config.connect.CLIENT_SERVICE)
        .map(res => res.json())
        .catch(this.handleError);
    }
  }

  //method to list down all the repositories
  getTree(repo) {
    if (this.userName) {
      return this._http.get(config.giturls.HOSTURL + this.userName + "/" +
          repo + '/contents?client_id=' + config.connect.CLIENT_ID +
          '&client_secret=' + config.connect.CLIENT_SERVICE)
        .map(res => res.json())
        .catch(this.handleError);
    }
  }

  //method to open the rpository and show all the files
  openFolder(repo, file) {
    if (this.userName) {
      let headers = new Headers({ 'accept': "application/vnd.github.VERSION.raw" });
      let options = new RequestOptions({ headers: headers });
      return this._http.get(config.giturls.HOSTURL + this.userName + "/" +
          repo + '/contents/' + file + '?client_id=' + config.connect.CLIENT_ID +
          '&client_secret=' + config.connect.CLIENT_SERVICE, options)
        .map(res => res.json())
    }
  }
  getFile(repo, file) {
    if (this.userName) {
      let headers = new Headers({ 'accept': "application/vnd.github.VERSION.raw" });
      let options = new RequestOptions({ headers: headers });
      return this._http.get(config.giturls.HOSTURL + this.userName + "/" +
        repo + '/contents/' + file + '?client_id=' + config.connect.CLIENT_ID +
        '&client_secret=' + config.connect.CLIENT_SERVICE, options)
    }
  }

  //method to create file on github
  createFile(text) {
    if (this.userName) {
      return this._http.get(config.giturls.HOSTURL + this.userName + '/' + text + config.giturls.SUBURL, this.authorization(this.accessToken))
        .map(res => res.json())
    }
  }

  //method to create the file and saving the sha-base-tree
  commitfile(text, sha) {
    if (this.userName) {
      return this._http.get(config.giturls.HOSTURL + this.userName + '/' + text + config.giturls.COMMITFILEURL + sha, this.authorization(this.accessToken))
        .map(res => res.json())
    }
  }

  //method to create file, sending new file name and saving the sha-new-tree
  treecommit(text, basetree) {
    if (this.userName) {
      return this._http.post(config.giturls.HOSTURL + this.userName + '/' + text + config.giturls.TREECOMMITURL, basetree, this.authorization(this.accessToken))
        .map(res => res.json())
    }
  }

  //method to create a file on github and saving sha-new-commit
  newcommit(text, newcommit) {
    if (this.userName) {
      return this._http.post(config.giturls.HOSTURL + this.userName + '/' + text + config.giturls.NEWCOMMITURL, newcommit, this.authorization(this.accessToken))
        .map(res => res.json())

    }
  }

  //method to create a fiel on github 
  lastcommit(text, lastcommit) {
    if (this.userName) {
      return this._http.post(config.giturls.HOSTURL + this.userName + '/' + text + config.giturls.SUBURL, lastcommit, this.authorization(this.accessToken))
        .map(res => res.json())
    }
  }

  //method to update the user
  updateUser(userName: string) {
    this.userName = userName;
  }
  //method to handle error
  private handleError(error: any) {
    if (error.status === 401) {
      return Observable.throw(error.status);
    } else {
      return Observable.throw(error.status || 'Server error');
    }
  }

  //method to get the sha of the file   
  getsha(text, filename) {
    if (this.userName) {
      return this._http.get(config.giturls.HOSTURL + this.userName + '/' + text + config.giturls.CONTENTURL + filename, this.authorization(this.accessToken))
        .map(res => res.json())
    }
  }

  //method to update the file on github
  updateFile(text, filename, updateobj) {
    if (this.userName) {
      return this._http.put(config.giturls.HOSTURL + this.userName + '/' + text + config.giturls.CONTENTURL + filename, updateobj, this.authorization(this.accessToken))
        .map(res => res.json())
    }
  }

  //method to delete the file on github
  deleteFile(text, filename, deletefileobj) {
    if (this.userName) {
      //let head=this.authoriZation();  
      let headers = new Headers({ 'Authorization': "Basic Z3J2Z3VwdGExMkBnbWFpbC5jb206Y2ZlNTA0ZjVkZDNkMGVmNGQzYmUwOWFlNmJjMTUzMmYyYTlhYzVmYg==" });
      return this._http.delete(config.giturls.HOSTURL + this.userName + '/' + text + config.giturls.CONTENTURL + filename, new RequestOptions({
          headers: headers,
          body: deletefileobj
        }))
        .map(res => res.json())
    }
  }
  //method to create user personal access token
  createToken(credentials, password) {
    console.log(credentials, "yyyyyyyyyyyyy");
    if (this.userName) {
      return this._http.post('https://api.github.com/authorizations', credentials, this.authorizationToken(this.userName, password))
        .map(res => res.json())
    }
  }
  //method to create Repository on github
  createRepos(text, accessToken) {
    this.accessToken = accessToken
    if (this.userName) {
      return this._http.post(config.giturls.CREATEREPOS, text, this.authorization(this.accessToken))
        .map(res => res.json())
    }
  }

  //method for authorization for creating new repository
  private authorization(accessToken) {
    let headers = new Headers({ 'Authorization': "Basic " + accessToken });
    return new RequestOptions({ headers: headers });
  }

  //method for authorization for creating personal access token
  private authorizationToken(userName, password) {
    console.log(userName, password)
    let data = btoa(userName + ':' + password)
    console.log('data-----------------------')
    console.log(data)
    let headers = new Headers({ "Authorization": "Basic " + data });
    return new RequestOptions({ headers: headers })
  }
}
