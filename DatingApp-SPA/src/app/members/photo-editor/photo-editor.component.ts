import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() photos: Photo[];
@Output() getMemberPhotoChange = new EventEmitter<string>(); // return new is main photo url
//@Output() outputTest = new EventEmitter<string>(); // return new is main photo url
uploader: FileUploader;
hasBaseDropZoneOver = false;
response: string;
baseUrl = environment.apiUrl;
currentMain: Photo;

  constructor(private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService){};


  ngOnInit() {
    this.initializeUploader();
    //this.outputTest.emit("output Lewis test");
  };


  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  };

  public initializeUploader()
  {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    }
    );

    // extends uploader class to overcome CORS issue
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    // after successful upload of photo, uses cloudinaries response to add file to photos array.
    this.uploader.onSuccessItem = ( item, response, status, headers ) => {
      if(response){
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };

        this.photos.push(photo);
      }
    }
  }

  setMainPhoto(photo: Photo){
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => { 
      this.currentMain = this.photos.filter(p => p.isMain === true)[0]; // returns an array of one item
      this.currentMain.isMain = false;
      photo.isMain = true;
      this.getMemberPhotoChange.emit(photo.url); // hoist photo url up to parent components
    }, error => {
      this.alertify.error(error);
    });
  }
}