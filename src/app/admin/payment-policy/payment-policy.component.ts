import { Component, OnInit } from '@angular/core';
import { PaymentPolicy } from './PaymentPolicy.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from '../payment-policy/form-dialog/form-dialog.component';


@Component({
  selector: 'app-payment-policy',
  standalone: true,
  imports: [BreadcrumbComponent, 
            MatCardModule,
            CommonModule,
            MatIconModule ,
            MatButtonModule,
  ],
  templateUrl: './payment-policy.component.html',
  styleUrl: './payment-policy.component.scss'
})
export class PaymentPolicyComponent implements OnInit {

  paymentPolicies: PaymentPolicy[] = [];

  constructor(private http: HttpClient,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchPaymentPolicies();
  }

  fetchPaymentPolicies(): void {
    this.http.get<PaymentPolicy[]>('https://backdeploy-7y83.onrender.com/payment-policy').subscribe(
      (data) => {
        this.paymentPolicies = data;
      },
      (error) => {
  
      }
    );
  }


  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        action: 'ADD',
      },
    });
  }
  
  edit() {
    if (this.paymentPolicies && this.paymentPolicies.length > 0) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        data: {
          _id:this.paymentPolicies[0]._id,
          action: 'EDIT',
          policy: this.paymentPolicies[0] // Vous pouvez changer l'index ici si nécessaire
        },
      });
    } else {
      // Gérer le cas où paymentPolicies est vide
 
    }
  }
  
  

  refresh() {
    // Implémentez la logique pour rafraîchir la liste

    this.fetchPaymentPolicies();

  
  }

  removeSelectedRows() {

  }

}
  
  


