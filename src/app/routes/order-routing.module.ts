import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from '../modules/order/cart/cart.component';
import { CheckoutComponent } from '../modules/order/checkout/checkout.component';
import { ShippingAddressAddComponent } from '../modules/order/shipping-address/shipping-address-add/shipping-address-add.component';
import { ShippingAddressUpdateComponent } from '../modules/order/shipping-address/shipping-address-update/shipping-address-update.component';
import { ShippingAddressListComponent } from '../modules/order/shipping-address/shipping-address-list/shipping-address-list.component';
import { CheckoutPromoComponent } from '../modules/order/checkout-promo/checkout-promo.component';

const orderRoutes: Routes = [
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'checkout/:promo/:code/:product', component: CheckoutPromoComponent },
  { path: 'shipping-address-add', component: ShippingAddressAddComponent },
  { path: 'shipping-address', component: ShippingAddressListComponent },
  { path: 'shipping-address/:id', component: ShippingAddressUpdateComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(orderRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class OrderRoutingModule { }
