import {Component, OnInit} from '@angular/core';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent  implements OnInit {

  text: string = ''
  ngOnInit(): void {
    if (this.decodeJwt()['role'] == "USER") {
      //this.text = "ти користувач"
    } else {
      //this.text = "ти Адмін"
    }
  }

  decodeJwt(): any {
    try {
      return jwt_decode(document.cookie.substring('jwtToken='.length));
    } catch (error) {
      console.error('Error decoding or verifying token:', error);
    }
  }
}
