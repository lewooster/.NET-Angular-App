import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class MemberEditResolver implements Resolve<User>{

    constructor(private userService: UserService,
        private router: Router,
        private alertify: AlertifyService,
        private authService: AuthService){}

    
    // returns observable
    resolve(route: ActivatedRouteSnapshot): Observable<User>{

        console.log(`Decoded Token ${this.authService.decodedToken.nameid}`)

        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(
                error => {
                    this.alertify.error('Problem retrieving your data');
                    this.router.navigate(['/members']);
                    // return observable of null
                    return of(null);
                })
        );
    }

};