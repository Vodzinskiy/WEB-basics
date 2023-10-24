import { Component } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  faculty: string;
  role: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';
}
