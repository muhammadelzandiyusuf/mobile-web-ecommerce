import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../modules/account/profile/profile/profile.component';
import { AccountComponent } from '../modules/account/account/account.component';
import { ProfileEditComponent } from '../modules/account/profile/profile-edit/profile-edit.component';
import { ProfilePasswordComponent } from '../modules/account/profile/profile-password/profile-password.component';
import { AccountShippingAddressComponent } from '../modules/account/shipping-address/account-shipping-address/account-shipping-address.component';
import { AccountShippingAddressAddComponent } from '../modules/account/shipping-address/account-shipping-address-add/account-shipping-address-add.component';
import { AccountShippingAddressUpdateComponent } from '../modules/account/shipping-address/account-shipping-address-update/account-shipping-address-update.component';
import { WishlistComponent } from '../modules/account/wishlist/wishlist.component';
import { LastViewComponent } from '../modules/account/last-view/last-view.component';
import { ReferralProgramComponent } from '../modules/account/referral-program/referral-program.component';
import { ReferralProgramDetailComponent } from '../modules/account/referral-program-detail/referral-program-detail.component';
import { HistoryOrderComponent } from '../modules/account/history/history-order/history-order.component';
import { HistoryOrderDetailComponent } from '../modules/account/history/history-order-detail/history-order-detail.component';
import { ProductReviewComponent } from '../modules/account/history/product-review/product-review.component';
import { TrackShippingComponent } from '../modules/account/history/track-shipping/track-shipping.component';
import { AccountTradeinComponent } from '../modules/account/account-tradein/account-tradein.component';
import { AccountTradeinDetailComponent } from '../modules/account/account-tradein-detail/account-tradein-detail.component';
import { BalanceComponent } from '../modules/account/balance/balance.component';
import { ProductDiscussionComponent } from '../modules/account/product-discussion/product-discussion.component';
import { ProductDiscussionDetailComponent } from '../modules/account/product-discussion-detail/product-discussion-detail.component';
import { TechnicianReviewComponent } from '../modules/account/technician-review/technician-review/technician-review.component';
import { TechnicianReviewFormComponent } from '../modules/account/technician-review/technician-review-form/technician-review-form.component';
import { VoucherComponent } from '../modules/account/voucher/voucher/voucher.component';
import { VoucherDetailComponent } from '../modules/account/voucher/voucher-detail/voucher-detail.component';
import { CommisionComponent } from '../modules/account/commision/commision.component';
import { CommisionDetailComponent } from '../modules/account/commision-detail/commision-detail.component';
import { NotificationComponent } from '../modules/notification/notification.component';

const accountRoutes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'account/profile', component: ProfileComponent },
  { path: 'account/profile/edit', component: ProfileEditComponent },
  { path: 'account/profile/change_password', component: ProfilePasswordComponent },
  { path: 'account/shipping_address', component: AccountShippingAddressComponent },
  { path: 'account/shipping_address/edit/:id', component: AccountShippingAddressUpdateComponent },
  { path: 'account/shipping_address/add', component: AccountShippingAddressAddComponent },
  { path: 'account/product', component: WishlistComponent },
  { path: 'account/product/wishlist', component: WishlistComponent },
  { path: 'account/product/last_view', component: LastViewComponent },
  { path: 'account/referral_program', component: ReferralProgramComponent },
  { path: 'invite/:product/:code', component: ReferralProgramDetailComponent },
  { path: 'account/history_order', component: HistoryOrderComponent },
  { path: 'account/history_order/detail/:code', component: HistoryOrderDetailComponent },
  { path: 'account/history_order/review/:code/:id', component: ProductReviewComponent },
  { path: 'account/track_shipping/:courier/:number', component: TrackShippingComponent },
  { path: 'account/trade_in', component: AccountTradeinComponent },
  { path: 'account/trade_in/:code', component: AccountTradeinDetailComponent },
  { path: 'account/balance', component: BalanceComponent },
  { path: 'account/product_discussion', component: ProductDiscussionComponent },
  { path: 'account/product_discussion/:id', component: ProductDiscussionDetailComponent },
  { path: 'account/technician_review', component: TechnicianReviewComponent },
  { path: 'account/technician_review/review/:id', component: TechnicianReviewFormComponent },
  { path: 'account/voucher', component: VoucherComponent },
  { path: 'account/voucher/:code', component: VoucherDetailComponent },
  { path: 'account/commisions', component: CommisionComponent },
  { path: 'commisions/withdraw', component: CommisionDetailComponent },
  { path: 'notification', component: NotificationComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(accountRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AccountRoutingModule { }
