import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {User} from "../app.component";
import {HttpClient} from "@angular/common/http";
import {catchError, EMPTY} from "rxjs";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['/../app.component.css']
})
export class AdminComponent implements OnInit {
  isRotated: boolean = false;
  @Input() myCard!: User;
  @Output() onRemove=new EventEmitter<string>()
  @ViewChild('adminCard') adminCard!: ElementRef;
  @ViewChild('minEmail') minEmail!: ElementRef;
  @ViewChild('minName') minName!: ElementRef;
  @ViewChild('userInfo') userInfo!: ElementRef;
  showPassword: boolean = false;
  isHidden: boolean = true;

  name: string = '';
  email: string = '';
  phone: string = '';
  faculty: string = '';
  address: string = '';
  birthDate: string = '';
  password: string = '';
  textError: string = '';
  role: string = '';
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
        this.fillFields()
    }

  showMore() {
    if (this.minEmail.nativeElement.innerText != '') {
      this.minEmail.nativeElement.innerText = ''
      this.minName.nativeElement.innerText = ''
      this.isHidden = false
    } else {
      this.minEmail.nativeElement.innerText = 'Email: ' + this.myCard.email
      this.minName.nativeElement.innerText = 'Name: ' + this.myCard.name
      this.isHidden = true
    }

    this.adminCard.nativeElement.classList.toggle('admin-card-max');
    this.isRotated = !this.isRotated;
  }

  delete() {
    this.http.delete('http://localhost:8080/' + this.myCard.id, {withCredentials: true})
      .subscribe()
    this.onRemove.emit(this.myCard.id)
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  fillFields() {
    this.http.get('http://localhost:8080/' + this.myCard.id)
      .subscribe((response) => {
        let json = JSON.stringify(response)
        let data = JSON.parse(json)
        this.name = data.name
        this.email = data.email
        this.phone = data.phone
        this.faculty = data.faculty
        this.address = data.address
        this.role = data.role
        try {
          this.birthDate = data.birthDate[0] + "-" + String(data.birthDate[1]).padStart(2, '0') + "-" + String(data.birthDate[2]).padStart(2, '0')
        } catch (e) {
          this.birthDate = ''
        }
      }, error => {
        console.log(error);
      });
  }

  async edit() {
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
      role: this.role,
      password: ''
    };
    if (this.password.toString() != '') {
      body.password = this.password;
    }
    this.http.patch('http://localhost:8080/' + this.myCard.id, body, {withCredentials: true}).pipe(
      catchError((error) => {
        if (error.status === 409) {
          this.textError = "User with this email already exists";
        }
        return EMPTY;
      })
    ).subscribe()
    this.password = ''
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
}
