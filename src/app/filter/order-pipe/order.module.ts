import { NgModule } from '@angular/core';
import { OrderByPipe } from './order.pipe';

@NgModule({
  declarations: [OrderByPipe],
  exports: [OrderByPipe],
  providers: [OrderByPipe]
})
export class OrderPipeModule {}