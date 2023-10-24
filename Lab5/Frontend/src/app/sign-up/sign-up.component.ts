import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { Validators, FormControl } from '@angular/forms';
import {catchError, EMPTY} from "rxjs";


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['/../app.component.css']
})
export class SignUpComponent {
  showPassword: boolean = false;
  name: string = '';
  email: string = '';
  phone: string = '';
  faculty: string = '';
  address: string = '';
  birthDate: string = '';
  password: string = '';
  textError: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  LoginPage() {
    this.router.navigate(['/login']);
  }

  google() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  signUp() {
    if (!this.validation()) {
      return
    }
      const body = {
      name: this.name,
      phone: this.phone,
      faculty: this.faculty,
      address: this.address,
      birthDate: this.birthDate.toString(),
      password: this.password,
      email: this.email
    };

    this.http.post('http://localhost:8080/signup', body).subscribe(
      (response) => {
        this.http.post('http://localhost:8080/login', {password: this.password, email: this.email}, {observe: 'response',
          withCredentials: true}).pipe().subscribe(
          (response) => {
            this.router.navigate(['/']);
          }
        );
      },
      (error) => {
        console.error('Error during sign-up', error);
      }
    );
  }

  validation(): boolean {
    this.textError = ''
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.name || !this.email || !this.phone || !this.faculty || !this.address || !this.birthDate || !this.password) {
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
