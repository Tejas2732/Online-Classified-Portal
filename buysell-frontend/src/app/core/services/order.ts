import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { Order } from '../../shared/models/order.model';
import { CreateOrderRequest } from '../../shared/models/create-order.model';
import { OrderReceipt } from '../../shared/models/order-receipt.model';


@Injectable({ providedIn: 'root' })
export class OrderService {

  private readonly API = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getMyOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(this.API);
  }

  createOrder(request: CreateOrderRequest) {
    return this.http.post<any>(`${this.API}`, request);
  }

  deleteOrder(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}
