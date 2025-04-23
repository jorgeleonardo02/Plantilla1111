 import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@auth0/auth0-angular';
import { QuillModule } from 'ngx-quill';
import { SwiperModule } from 'swiper/angular';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { AppComponent } from './app.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { FormCategoriaComponent } from './categoria/form-categoria/form-categoria.component';
import { FormCursoComponent } from './curso/form-curso/form-curso.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './seguridad/auth/login.component';
import { RegistroComponent } from './seguridad/auth/registro.component';
import { IndexComponent } from './seguridad/index/index.component';
import { LoginGuard } from './seguridad/guards/login.guard';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { CuerpoComponent } from './curso/cuerpo/cuerpo.component';
import { CarritoComponent } from './carrito/carrito.component';
import { DetalleCursoComponent } from './curso/detalle-contenido/detalle-curso.component';
import { EstrellaComponent } from './estrella/estrella.component';
import { ChatComponent } from './chat/chat.component';
import { ContenidoProgramaticoComponent } from './curso/contenido-programatico/contenido-programatico.component';
import { SubseccionComponent } from './subseccion/subseccion/subseccion.component';
import { interceptorProvider } from './seguridad/interceptors/pro-interceptor.service';
import { StompConfig } from '@stomp/stompjs';
import { MatExpansionModule } from '@angular/material/expansion';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'categorias', component: CategoriaComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'registro', component: RegistroComponent },
  { path: 'inicio', component: IndexComponent },
  { path: 'curso/:nombreCategoria', component: CuerpoComponent },
  { path: 'programa', component: ContenidoProgramaticoComponent },
  { path: 'detalle/:id', component: DetalleCursoComponent },
  { path: 'chat/:userId', loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent) },
  { path: 'carrito', component: CarritoComponent },
  { path: '**', redirectTo: '/inicio' },
];

@NgModule({
  declarations: [
    AppComponent,
    CategoriaComponent,
    FormCategoriaComponent,
    FormCursoComponent,
    FooterComponent,
    LoginComponent,
    RegistroComponent,
    IndexComponent,
    EncabezadoComponent,
    CuerpoComponent,
    CarritoComponent,
    EstrellaComponent,
    DetalleCursoComponent,
    ContenidoProgramaticoComponent,
    SubseccionComponent, // Declarar SubseccionComponent aquí
  ],
  imports: [
    MatExpansionModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    QuillModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatMomentDateModule,
    SwiperModule,
  ],
  providers: [
    interceptorProvider,
    StompConfig,
    provideHttpClient(withInterceptorsFromDi())
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
