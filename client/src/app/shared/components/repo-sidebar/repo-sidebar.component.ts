import { Component, OnInit, Output, Input, EventEmitter, TemplateRef,ViewChild,ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import swal from 'sweetalert2';

/*import third party libraries*/
import { EditorService } from '../../services/editor.service';
import { GitService } from '../../services/git.service';
import { config } from './../../config/repoSidebar.config';
import { ProfileService } from '../../services/profile.service'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-repo-sidebar',
  templateUrl: './repo-sidebar.component.html',
  styleUrls: ['./repo-sidebar.component.css']
})

export class RepoSidebarComponent implements OnInit {

  @ViewChild('newRepository') newRepository: ElementRef;

  @Input() mode: String;
  config = config;
  /*declaring all the required variables*/
  githubUser: any;
  selectedValue: any;
  reponamed: any;
  filenamed: any;
  data: any;
  fileData: any;
  selectedfile: any;
  url: any = "";
  text: any = config.repoSidebar.ENTER_CODE;
  public modalRef: BsModalRef;
  value: any;
  accessToken: any;
  data1: any;
  currentUser: any;
  isTree: Boolean = true;
  public emptyRepo: String;
  extension: any;
  confirm: any;
  folder : any;

  // @Input() personalAccessToken;
  @Output() content = new EventEmitter < any > ();
  @Output() repoName = new EventEmitter < any > ();
  @Output() fileName = new EventEmitter < any > ();
  @Output() editorMode = new EventEmitter < any > ();

  constructor(private editorService: EditorService, private gitService: GitService,
    private modalService: BsModalService, private profileService: ProfileService,
    private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.authenticationService.getPersonalAccessToken(this.currentUser.userId)
      .subscribe((res) => {
        this.authenticationService.pacToken = res.data.accessToken;
        // this.data1 = {
        //   accessToken: res.data.accessToken
        // }
        // this.data1 = this.data1.accessToken
      })

    this.gitService.getRepos()
      .subscribe(repos => {
        this.githubUser = repos;
      })
  }

  public openRepoModal(template: TemplateRef < any > ) {
    this.modalRef = this.modalService.show(template);
  }
   public openTokenModal(template: TemplateRef < any > ) {
    this.modalRef = this.modalService.show(template);
  }

  /*calling method to search repositery*/
  reposearch() {
    this.reponamed = this.selectedValue;
    this.gitService.getTree(this.selectedValue)
      .subscribe(data => {
        this.isTree = true;
        this.data = data;
        this.repoName.emit(this.reponamed);
      }, err => {
        this.isTree = false;
        if (err === 404)
          this.emptyRepo = config.repoSidebar.EMPTY_REPO;
      })
  }

  /*method used to show repositery name and file name*/
  showFile(reponame, filename) {
    this.extension = filename.split('.').pop();
    this.folder = filename.split('.');
    if (this.folder.length > 1) {
      if (this.mode === "javascript" && this.extension !== "js") {
        this.confirm = confirm(config.repoSidebar.HTML_MODE)
        if (this.confirm === true) {
          this.mode = "html"
          this.editorMode.emit(this.mode);
        }
      } else if (this.mode === "html" && this.extension !== "html" && this.extension !== "css") {
        this.confirm = confirm(config.repoSidebar.JAVASCRIPT_MODE)
        if (this.confirm === true) {
          this.mode = "javascript"
          this.editorMode.emit(this.mode);
        }
      }
    }
    this.reponamed = this.selectedValue;
    this.gitService.openFolder(reponame, filename)
      .subscribe(
        data => {
          this.data = data
          this.url = this.url + filename + "/"
        }, err => {
          this.show(reponame, this.url + filename)
          this.url = "";
        })
  }

  //method used to show content of file present in repository
  show(reponame, filename) {
    this.reponamed = reponame;
    this.filenamed = filename;
    this.gitService.getFile(reponame, filename)
      .subscribe(data => {
        this.fileData = data;
        this.text = this.fileData._body;
        this.content.emit(this.text);
        this.repoName.emit(this.reponamed);
        this.fileName.emit(this.filenamed);
      })
  }

  creteNewRepo(form){
   this.newRepository.nativeElement.click();
   this.createRepo(form.value.repositoryName,form.value.description);
   form.reset();
 }

  //method for creating new repository
  createRepo(name, desc) {
    let repoName = {
      "name": name,
      "description": desc,
      "homepage": "https://github.com",
      "private": false,
      "auto_init": true,
      "has_issues": false,
      "has_projects": false,
      "has_wiki": false
    }

    this.gitService.createRepos(repoName)
      .subscribe(data => {
        if (data) {
          swal({
            timer: 2500,
            title: config.repoSidebar.REPO_CREATED,
            text: "",
            type: 'success',
            showConfirmButton: false,
          })
        } else {
          swal({
            timer: 2500,
            title: config.repoSidebar.REPO_NOT_CREATED,
            text: "",
            type: 'error',
            showConfirmButton: false,
          })
        }
      })
  }

}
