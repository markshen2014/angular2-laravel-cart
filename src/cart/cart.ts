import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { contentHeaders } from '../common/headers';

const styles = require('./cart.css');
const template = require('./cart.html');

@Component({
  selector: 'products',
  template: template,
  styles: [ styles ]
})
export class Cart {
  jwt: string;
  decodedJwt: string;
  response: string;
  api: string;
  total: number;
  cartItems:  Array<CartItem> = new Array<CartItem>();

  constructor(public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('id_token');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
    this.getCart();
  }

  logout() {
    localStorage.removeItem('id_token');
    this.router.navigate(['login']);
  }

  getCart() {
    this.http.get('http://landmark.localhost.com/api/cart', { headers: contentHeaders })
      .subscribe(
      response => {
          this.total = response.json().total;
          this.cartItems = response.json().cart_items;
        console.log(response.json().cart_items);
      },
      error => {
        alert(error.text());
        console.log(error.text());
      }
      );
  }

  emptyCart() {
    this.http.get('http://landmark.localhost.com/api/cart/empty', { headers: contentHeaders })
      .subscribe(
      response => {
          this.total = response.json().total;
          this.cartItems = response.json().cart_items;
          alert('Cart emptied');
          console.log(response.json().cart_items);
      },
      error => {
        alert(error.text());
        console.log(error.text());
      }
      );
  }

  removeItems(quantity, id) {
    let body = JSON.stringify({ 'product_id': id, 'quantity': quantity});
    this.http.post('http://landmark.localhost.com/api/cart/remove', body,
    { headers: contentHeaders })
      .subscribe(
        response => {
          alert('Removed ' + quantity + ' item/s');
          this.total = response.json().total;
          this.cartItems = response.json().cart_items;
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }
}

interface CartItem {
    id: number;
    product: Product;
    product_id: number;
    quantity: number;
    price: string;
}

interface Product {
    id: number;
    product_name: string;
    price: number;
    product_category: string;
    product_sub_category: string;
    attributes: string;
}