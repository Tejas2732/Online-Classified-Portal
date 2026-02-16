import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { Product } from '../../shared/models/product.model';
import { CreateProductRequest } from '../../shared/models/create-product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly API = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  
  getMyProducts() {
    return this.http.get<any>(`${this.API}/my-products`);
  }
  

  getProductById(id: number) {
    console.log(` the api for the producyy si s -> ${this.API}/${id}`);
    return this.http.get<any>(`${this.API}/${id}`);
  }
  
  
  updateProduct(id: number, data: any) {
    return this.http.put(`${this.API}/${id}`, data);
  }
  
  deleteProduct(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
  

createProduct(request: CreateProductRequest) {
  return this.http.post(`${this.API}`, request);
}

getAvailableProducts(): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(`${this.API}`);
}

}

