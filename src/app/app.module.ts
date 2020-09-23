import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';

import { NgxSoapModule } from 'ngx-soap';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';

const ANGULAR_MATERIAL_MODULES = [
  MatToolbarModule, MatInputModule, MatButtonModule, MatCardModule,
  MatProgressBarModule, MatFormFieldModule
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxSoapModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ...ANGULAR_MATERIAL_MODULES
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
