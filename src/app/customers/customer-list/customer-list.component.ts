import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
	customers:Customer[] = [
	new Customer(1,'Kowalski','Jan'),
	new Customer(2,'Kowalska','Janina'),
	new Customer(3,'Nowak','Jan')
	];

  constructor() { }

  ngOnInit() {
  }

}
