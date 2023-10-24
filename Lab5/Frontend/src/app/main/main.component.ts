import {Component, OnInit} from '@angular/core';
import jwt_decode from 'jwt-decode';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {HttpClient} from "@angular/common/http";
import {User} from "../app.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['/../app.component.css']
})
export class MainComponent implements OnInit {
  showPassword: boolean = false;
  name: string = '';
  email: string = '';
  phone: string = '';
  faculty: string = '';
  address: string = '';
  birthDate: string = '';
  password: string = '';
  textError: string = '';
  text: string = ''
  users: User[] = []


  constructor(private router: Router,
              private cookieService: CookieService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    try {
      this.fillFields()
      if (this.decodeJwt()['role'] == "ADMIN") {
        this.admin()
      }
    } catch (e) {
      console.log(e)
      this.router.navigate(['/login']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  decodeJwt(): any {
    try {
      return jwt_decode(document.cookie.substring('jwtToken='.length));
    } catch (error) {
      console.error('Error decoding or verifying token:', error);
    }
  }

  signOut() {
    this.cookieService.delete("jwtToken", '/', 'localhost')
    this.router.navigate(['/login']);
  }

  fillFields() {
    this.http.get('http://localhost:8080/' + this.decodeJwt()['jti'])
      .subscribe((response) => {
        let json = JSON.stringify(response)
        let data = JSON.parse(json)
        this.name = data.name
        this.email = data.email
        this.phone = data.phone
        this.faculty = data.faculty
        this.address = data.address
        try {
          this.birthDate = data.birthDate[0] + "-" + String(data.birthDate[1]).padStart(2, '0') + "-" + String(data.birthDate[2]).padStart(2, '0')
        } catch (e) {
          this.birthDate = ''
        }
      }, error => {
        console.log(error);
      });
  }

  edit() {
    if (!this.validation()) {
      return
    }
    const body = {
      name: this.name,
      phone: this.phone,
      faculty: this.faculty,
      address: this.address,
      birthDate: this.birthDate.toString(),
      email: this.email,
      password: ''
    };
    if (this.password.toString() != '') {
      body.password = this.password;
    }
    this.http.patch('http://localhost:8080/' + this.decodeJwt()['jti'], body, {withCredentials: true}).subscribe()
    this.password = ''
  }

  delete() {
    this.http.delete('http://localhost:8080/' + this.decodeJwt()['jti'], {withCredentials: true})
      .subscribe(() => {
        this.signOut()
      });
  }

  validation(): boolean {
    this.textError = ''
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.name || !this.email || !this.phone || !this.faculty || !this.address || !this.birthDate) {
      this.textError = "Please complete all fields";
      return false
    }
    if (!emailPattern.test(this.email)) {
      this.textError = "Please enter a valid email address";
      return false
    }
    return true
  }

  admin() {
    this.http.get('http://localhost:8080/', {withCredentials: true}).subscribe(
      (response) => {
        let json = JSON.stringify(response)
        JSON.parse(json)
        for (let i = 0; i < JSON.parse(json).length; i++) {
          let j = JSON.parse(json)[i]
          const u: User = {
            address: j.address,
            birthDate: j.birthDate,
            email: j.email,
            faculty: j.faculty,
            id: j.id,
            name: j.name,
            phone: j.phone,
            role: j.role
          }
          if (j.role != "ADMIN") {
            this.users.unshift(u)
          }
        }
      }
    )
  }

  deleteCard(id: string) {
    this.users = this.users.filter(c => c.id !== id)
  }
}
