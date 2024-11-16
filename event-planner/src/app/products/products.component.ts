import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products = [
    { image: 'assets/images/product.jpg' },
    { image: 'assets/images/product.jpg' },
    { image: 'assets/images/product.jpg' },
    { image: 'assets/images/product.jpg' },
    { image: 'assets/images/product.jpg' },
  ];
}

