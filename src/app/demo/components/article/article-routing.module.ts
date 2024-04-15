import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './article.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(
    [{component:ArticleComponent,path:""}]
  )],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
