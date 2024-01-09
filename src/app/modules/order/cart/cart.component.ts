import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../../service/cart/cart.service';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../service/wishlist/wishlist.service';
import { FormControl } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { WarrantyService } from '../../../service/warranty/warranty.service';

declare function googleTagConversion(param :any): any;
 
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy  {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any

  name: string
  quantity: number = 1
  actionDelete: boolean = false
  actionDestroy: boolean = false
  metaTag: any;
  carts: any = null;
  contents: any;
  total: any;
  totalItems: any;
  localCart: any = []
  totalLocal: any;
  countCart: any;
  actionDestroyLocal: boolean = false;
  localItemCart: any = null;
  cartDelete: any = []
  quantityLocal: number = 1;
  idProductCart: number = null;
  cartQuantity: any = []
  checkoutCart: boolean = false;
  totalCart: any;
  warranty = new FormControl()
  contractService = new FormControl()
  countLocal: any;
  lang: any;
  token: any;
  deleteId: any;
  pdfFile: any;

  constructor(
    private cartService: CartService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private toastr: ToastrService,
    private wishlistService: WishlistService,
    private warrantyService: WarrantyService
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token != null) {
            this.getListCart(this.token)
        }
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Cart');
  }

  getMeta() {
    this.termService.getTagMeta()
    .subscribe((meta: any) => {
        this.metaTag = meta['kitchenart']['results'];

        this.meta.addTags([
            {name: 'description', content: this.metaTag['meta_description']},
            {name: 'author', content: 'kitchenart.id'},
            {name: 'keywords', content: this.metaTag['meta_keyword']}
          ]);
    })
  }

  ngOnInit() {
    this.name = "8 Channels 1470-1610nm Dual Fiber CWDM Mux Demux with Monitor Port, Expansion Port and 1310nm Port, FMU Plug-in Module, LC/UPC";
  }
  
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if(this.subcription){
      this.subcription.unsubscribe();
    }
  }

  initialiseInvites() {
    this.lang = this.localSt.retrieve('lang');
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    this.localItemCart = this.localSt.retrieve('carts')
    this.countLocal = this.localCart.length

    if(this.localItemCart != null){
        this.localCart = this.localItemCart
        this.countCart = this.localItemCart.length
        this.totalLocal = 0;
        for (let object of this.localItemCart) {
          this.totalLocal += object.subtotal
        }
    }
  }

  warrantyDownloadPdf() {
    this.warrantyService.getWarrantyFile()
    .subscribe((warranty: any) => {
      console.log('success')
    })
  }

  getListCart(token: any) {
    this.cartService.getListCart(token)
    .subscribe((cart: any) => {
      this.carts = cart['kitchenart']['results']
      this.contents = this.carts['contents']
      this.total = this.carts['total']
      this.totalItems = this.carts['total_items']
      this.totalCart = this.carts.length
      googleTagConversion(this.total)
    })
  }

  cartAddWarranty(cart_id: any) {
    this.cartService.postAddWarranty(cart_id, this.warranty.value, this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.getListCart(this.token)
      }
      else{
        let message = cart['kitchenart']['results']['message']
        this.messageErorWarranty(message)
      }
    })
  }

  removeWarranty(cart_id: any) {
    this.cartService.postDeleteWarranty(cart_id, this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.getListCart(this.token)
      }
      else{
        let message = cart['kitchenart']['results']['message']
        this.messageErorWarranty(message)
      }
    })
  }

  cartAddContractService(cart_id: any) {
    this.cartService.postAddContractService(cart_id, this.contractService.value, this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.getListCart(this.token)
      }
      else{
        let message = cart['kitchenart']['results']['message']
        this.messageErorWarranty(message)
      }
    })
  }

  removeContractService(cart_id: any) {
    this.cartService.postDeleteContractService(cart_id, this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.getListCart(this.token)
      }
      else{
        let message = cart['kitchenart']['results']['message']
        this.messageErorWarranty(message)
      }
    })
  }

  plusQuantity(quantity: any, maxQunatity: any, cart_id: any) {
    this.quantity = quantity
    if(this.quantity < maxQunatity){
      this.quantity++
    }
    this.cartService.postEdit(cart_id, this.quantity, this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.getListCart(this.token)
      }
      else{
        this.showErrorUpdate()
      }
    })
  }

  minusQuantity(quantity: any, cart_id: any) {
    this.quantity = quantity
    if(this.quantity > 1){
      this.quantity--
    }
    this.cartService.postEdit(cart_id, this.quantity, this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.getListCart(this.token)
      }
      else{
        this.showErrorUpdate()
      }
    })
  }

  addWishlist(product_id: any) {
    this.wishlistService.postAdd(product_id, this.token)
    .subscribe((wishlist: any) => {
        let status = wishlist['kitchenart']['results']['status']
        if(status == 'success') {
          this.showSuccessAddWishlist()
          this.getListCart(this.token)
        }
        else{
          this.showErrorUpdate()
        }
    })
  }

  startShopping() {
    this.router.navigate(['/']);
  }

  deleteProduct(id: any) {
    this.deleteId = id
    this.actionDelete = true
  }

  emptyCart() {
    this.actionDestroy = true
  }

  emptyCartLocal() {
    this.actionDestroyLocal = true
  }

  closeDelete(){
    this.actionDelete = false
    this.actionDestroy = false
    this.actionDestroyLocal = false
  }

  destroyChart() {
    this.cartService.postDestroy(this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.showSuccessDestroy()
        this.getListCart(this.token)
        this.carts = null
        setTimeout(() => {
          location.reload();
        }, 3000)
      }
      else{
        this.showError()
      }
    })
  }

  destroyChartLocal() {
    if(this.localItemCart != null) {
      this.localSt.clear('carts');
      this.showSuccessDestroy()
      this.localCart = this.localSt.retrieve('carts')
      this.localItemCart = null
      this.totalLocal = 0;
      this.closeDelete()
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
    else{
      this.showErrorEmpty()
    }
  }

  removeItemAddWishlist() {
    this.cartService.postDeleteWishlist(this.deleteId, this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.showSuccessWishlist()
        this.getListCart(this.token)
        this.closeDelete()
        setTimeout(() => {
          location.reload();
        }, 3000)
      }
      else{
        this.showError()
      }
    })
  }

  removeItem() {
    this.cartService.postDelete(this.deleteId, this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.showSuccess()
        this.getListCart(this.token)
        this.closeDelete()
        setTimeout(() => {
          location.reload()
        }, 3000);
      }
      else{
        this.showError()
      }
    })
  }

  plusQuantityLocal(quantity: any, product_id: any) {
    this.quantityLocal = quantity
    this.localCart = this.localSt.retrieve('carts')
    if(this.quantityLocal < 5){
      this.quantityLocal++

      this.cartQuantity = []
      for (let object of this.localCart) {
        if(object.product_id == product_id){
          this.cartQuantity.push(
            {
              'product_id' : object.product_id,
              'quantity' : this.quantityLocal,
              'brand' : object.brand,
              'subtotal' : object.price * this.quantityLocal,
              'price' : object.price,
              'name' : object.name,
              'image_domain' : object.image_domain,
              'product_image_path' : object.product_image_path,
              'unit_image' : object.unit_image,
            }
          )
        }
        else{
          this.cartQuantity.push(
            {
              'product_id' : object.product_id,
              'quantity' : object.quantity,
              'brand' : object.brand,
              'subtotal' : object.subtotal,
              'price' : object.price,
              'name' : object.name,
              'image_domain' : object.image_domain,
              'product_image_path' : object.product_image_path,
              'unit_image' : object.unit_image
            }
          )
        }
      }
      this.localSt.store('carts', this.cartQuantity);
      this.localCart = this.localSt.retrieve('carts')
      this.totalLocal = 0;
        for (let object of this.localCart) {
          this.totalLocal += object.subtotal
        }
    }
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  minusQuantityLocal(quantity: any, product_id: any) {
    this.quantityLocal = quantity
    this.localCart = this.localSt.retrieve('carts')
    if(this.quantityLocal > 1){
      this.quantityLocal--
      this.cartQuantity = []
      for (let object of this.localCart) {
        if(object.product_id == product_id){
          this.cartQuantity.push(
            {
              'product_id' : object.product_id,
              'quantity' : this.quantityLocal,
              'brand' : object.brand,
              'subtotal' : object.price * this.quantityLocal,
              'price' : object.price,
              'name' : object.name,
              'image_domain' : object.image_domain,
              'product_image_path' : object.product_image_path,
              'unit_image' : object.unit_image
            }
          )
        }
        else{
          this.cartQuantity.push(
            {
              'product_id' : object.product_id,
              'quantity' : object.quantity,
              'brand' : object.brand,
              'subtotal' : object.subtotal,
              'price' : object.price,
              'name' : object.name,
              'image_domain' : object.image_domain,
              'product_image_path' : object.product_image_path,
              'unit_image' : object.unit_image
            }
          )
        }
      }
      this.localSt.store('carts', this.cartQuantity);
      this.localCart = this.localSt.retrieve('carts')
      this.totalLocal = 0;
        for (let object of this.localCart) {
          this.totalLocal += object.subtotal
        }
    }
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  removeItemLocal(product_id: any) {
    if(this.countCart > 1){
      for (let object of this.localCart) {
        if(object.product_id != product_id){
          this.cartDelete.push({
            'product_id' : object.product_id,
            'quantity' : object.quantity,
            'brand' : object.brand_name,
            'subtotal' : object.subtotal,
            'price' : object.price,
            'name' : object.name,
            'image_domain' : object.image_domain,
            'product_image_path' : object.product_image_path,
            'unit_image' : object.unit_image
          })
          this.localSt.store('carts', this.cartDelete);
        }
      }
    }
    else{
      this.localSt.clear('carts');
      this.localItemCart = null
    }
    this.showSuccess()
    this.localCart = this.localSt.retrieve('carts')
    this.totalLocal = 0;
    if(this.localCart != null){
      this.countCart = this.localCart.length
      for (let object of this.localCart) {
        this.totalLocal += object.subtotal
      }
    }
    this.closeDelete()
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  cartCheckout(){
    this.checkoutCart = true
    setTimeout(() => {
        this.checkoutCart = false
        this
            .router
            .navigate(['/checkout']);
    }, 2000);
  }

  checkOutLocal() {
    this.messageCheckoutError()
  }

  showSuccess() {
    if(this.lang == 'en'){
      this.toastr.success('Product Removed');
    }
    else{
      this.toastr.success('Produk Dihapus');
    }
    
  }

  showError() {
    if(this.lang == 'en'){
      this.toastr.error('Can Not Remove');
    }
    else{
      this.toastr.error('Tidak bisa menghapus');
    }
  }

  showErrorEmpty() {
    if(this.lang == 'en'){
      this.toastr.error('Cart is empty');
    }
    else{
      this.toastr.error('Keranjang Kosong');
    }
  }

  showErrorUpdate() {
    if(this.lang == 'en'){
      this.toastr.error('Can Not Update');
    }
    else{
      this.toastr.error('Tidak Dapat Memperbarui');
    }
  }

  showSuccessWishlist() {
    if(this.lang == 'en'){
      this.toastr.success('Success remove and add to wishlist');
    }
    else{
      this.toastr.success('Berhasil menghapus dan menambahkan ke wishlist');
    }
  }

  showSuccessDestroy() {
    if(this.lang == 'en'){
      this.toastr.success('Success remove all');
    }
    else{
      this.toastr.success('Berhasil menghapus semua');
    }
  }

  showSuccessAddWishlist() {
    if(this.lang == 'en'){
      this.toastr.success('Success add to wishlist');
    }
    else{
      this.toastr.success('Berhasil menambah ke daftar wishlist');
    }
  }

  messageCheckoutError() {
    if(this.lang == 'en'){
      this.toastr.warning('Please Login');
    }
    else{
      this.toastr.warning('Silahkan Login');
    }
  }

  messageErorWarranty(message: any) {
    this.toastr.warning(message);
  }

}
