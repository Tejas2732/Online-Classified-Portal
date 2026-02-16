import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-profile.html', styleUrls: ['./admin-profile.css'],
})
export class AdminProfileComponent implements OnInit {

  admin: any;
 
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getProfile().subscribe(res => {
      this.admin = res.data;
    });
  }
}
