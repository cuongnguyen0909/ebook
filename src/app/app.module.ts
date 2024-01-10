import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReadingBookComponent } from './components/reading-book/reading-book.component';
import { PrevDirective } from './directives/prev.directive';
import { NextDirective } from './directives/next.directive';
import { ToggleDiscoverDirective } from './directives/toggle-discover.directive';
import { LoginComponent } from './components/login/login.component';
import { ToggleLoginDirective } from './directives/toggle-login.directive';
import { BooksByGenresComponent } from './components/books-by-genres/books-by-genres.component';
import { HomeComponent } from './components/home/home.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { HoverToggleDirective } from './directives/hover-toggle.directive';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { NgIconsModule } from '@ng-icons/core';
import { heroUsers, heroArrowRightOnRectangle } from '@ng-icons/heroicons/outline';
import { CustomInterceptor } from './services/interceptors/custom.interceptor';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    ReadingBookComponent,
    PrevDirective,
    NextDirective,
    ToggleDiscoverDirective,
    LoginComponent,
    ToggleLoginDirective,
    BooksByGenresComponent,
    HomeComponent,
    BookDetailComponent,
    HoverToggleDirective,
    RegisterComponent,
    FooterComponent,
    StarRatingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({ heroUsers, heroArrowRightOnRectangle }),
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
