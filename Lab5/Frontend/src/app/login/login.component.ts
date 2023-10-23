import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {catchError, EMPTY} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['/../app.component.css']
})
export class LoginComponent {
  showPassword: boolean = false;
  email: string = '';
  password: string = '';
  textError: string = '';

  constructor(private router: Router, private http: HttpClient) {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  signUpPage() {
    this.router.navigate(['/signup']);
  }

  google() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  login() {
    if (!this.validation()) {
      return
    }
    const body = {
      password: this.password,
      email: this.email
    };
    this.http.post('http://localhost:8080/login', body, {observe: 'response',
      withCredentials: true}).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.textError = "Incorrect login or password";
        }
        return EMPTY;
      })
    ).subscribe(
      (response) => {
        this.router.navigate(['/']);
      }
    );
  }

  validation(): boolean {
    this.textError = ''
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email || !this.password) {
      this.textError = "Please complete all fields";
      return false
    }
    if (!emailPattern.test(this.email)) {
      this.textError = "Please enter a valid email address";
      return false
    }
    return true
  }
}
