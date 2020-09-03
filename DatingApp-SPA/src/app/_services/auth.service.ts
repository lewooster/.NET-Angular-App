import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment } from '../../environments/environment';

import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = environment.apiUrl + 'auth/';

private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

jwtHelper = new JwtHelperService();
decodedToken: any;




constructor(private http: HttpClient) { }

login(model:any){
  return this.http.post(this.baseUrl + 'login', model,this.options)
  .pipe(
    map((response: any) => {
      const user = response;

      if(user){
        localStorage.setItem("token",user.token);
        this.decodedToken = this.jwtHelper.decodeToken(user.token);
      }
    })
  );
}

register(model: any){
  return this.http.post(this.baseUrl+'register',model);
}

// returns true if JWT token is validated
loggedIn(){
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}



}
