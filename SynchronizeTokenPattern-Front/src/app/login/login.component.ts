import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userdetails = { username: '', password: '' }
  auth = false
  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.http.post('http://localhost:3000/login', {
      username: this.userdetails.username,
      password: this.userdetails.password
    }).subscribe(
      res => {
        let response;
        response = res;
        console.log(res);

        if (response.status == "Failed") {
          console.log("Authentication Failed")
          this.auth = true
        }
        else {
          this.auth = false
          this.cookieService.set('SessionID', response.sessioniD);
          this.router.navigate(['/profile']);
        }
      },
      err => {
        console.log(err);
      }
    )
  }

}
