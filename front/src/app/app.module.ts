/* import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
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
import { AppComponent } from './app.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { FormCategoriaComponent } from './categoria/form-categoria/form-categoria.component';
//import { ContenidoComponent } from './contenido/contenido/contenido.component';
//import { DetalleContenidoComponent } from './contenido/detalle-contenido/detalle-contenido.component';
import { FormContenidoComponent } from './contenido/form-contenido/form-contenido.component';
import { FooterComponent } from './footer/footer.component';
//import { MenuComponent } from './menu/menu.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './seguridad/auth/login.component';
import { RegistroComponent } from './seguridad/auth/registro.component';
import { interceptorProvider } from './seguridad/interceptors/pro-interceptor.service';
import { IndexComponent } from './seguridad/index/index.component';
import { AuthModule } from '@auth0/auth0-angular';
import { LoginGuard } from './seguridad/guards/login.guard';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { CuerpoComponent } from './cuerpo/cuerpo.component';
//import { StompConfig, StompService } from '@stomp/ng2-stompjs'; 
import { StompConfig } from '@stomp/stompjs';
//**************************************************************************** 
import { MatTabsModule } from '@angular/material/tabs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SwiperModule } from 'swiper/angular';
import { CarritoComponent } from './carrito/carrito.component';
import { DetalleContenidoComponent } from './contenido/detalle-contenido/detalle-contenido.component';
import { EstrellaComponent } from './estrella/estrella.component';
import  SockJS from 'sockjs-client';
import { ChatComponent } from './chat/chat.component';
import { QuillModule } from 'ngx-quill';
import { ContenidoProgramaticoComponent } from './contenido/contenido-programatico/contenido-programatico.component';
import { CommonModule } from '@angular/common';
import { SubseccionComponent } from './subseccion/subseccion/subseccion.component';
//import { SwiperComponent } from 'ngx-swiper-wrapper';


const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  

  {
    path: 'categorias',
    component: CategoriaComponent//,
    //canActivate: [LoginGuard], 
  },

  //{ path: 'contenido', component: ContenidoComponent },

  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [LoginGuard]
  },

  {
    path: 'registro',
    component: RegistroComponent// ,
    //canActivate: [LoginGuard] 
  },

  { path: 'inicio', component: IndexComponent },
  //{ path: 'cuerpo/:idCategoria',  component: CuerpoComponent },
  { path: 'curso/:nombreCategoria', component: CuerpoComponent},
  { path: 'programa', component: ContenidoProgramaticoComponent},
  { path: 'detalle/:id', component: DetalleContenidoComponent },
  //{ path: 'chat/:userId', component: ChatComponent},
  { path: 'chat/:userId', loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent)}, // Carga el componente standalone
  { path: 'carrito', component: CarritoComponent },
  { path: '**', redirectTo: '/inicio' },
];
@NgModule({ declarations: [
        AppComponent,
        //CommonModule,
        ContenidoProgramaticoComponent,
        //MenuComponent,
        FooterComponent,
        //ContenidoComponent,
        //ChatComponent,
        CategoriaComponent,
        FormCategoriaComponent,
        FormContenidoComponent,
        DetalleContenidoComponent,
        LoginComponent,
        RegistroComponent,
        IndexComponent,
        EncabezadoComponent,
        CuerpoComponent,
        CarritoComponent,
        EstrellaComponent,
    ],
    bootstrap: [AppComponent],
    exports: [RouterModule, SubseccionComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    imports: [
      //QuillModule,
      QuillModule.forRoot(), // Añade QuillModule aquí
      FormsModule,
        MatGridListModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        MatCardModule,
        ToastrModule.forRoot(),
        MatTableModule,
        BrowserModule,
        MatSnackBarModule,
        MatTabsModule,
        //MatTableDataSource,
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
        MatGridListModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        SwiperModule,
        // Import the module into the application, with configuration
        AuthModule.forRoot({
            domain: 'dev-raf1r7abq103mk71.us.auth0.com',
            clientId: 'YMbmAKbkQTzZjCgSP9DUIODlDsKFV5Bt',
            authorizationParams: {
                redirect_uri: window.location.origin,
            },
        })], providers: [interceptorProvider, StompConfig, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
 */
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
import { FormContenidoComponent } from './contenido/form-contenido/form-contenido.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './seguridad/auth/login.component';
import { RegistroComponent } from './seguridad/auth/registro.component';
import { IndexComponent } from './seguridad/index/index.component';
import { LoginGuard } from './seguridad/guards/login.guard';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { CuerpoComponent } from './cuerpo/cuerpo.component';
import { CarritoComponent } from './carrito/carrito.component';
import { DetalleContenidoComponent } from './contenido/detalle-contenido/detalle-contenido.component';
import { EstrellaComponent } from './estrella/estrella.component';
import { ChatComponent } from './chat/chat.component';
import { ContenidoProgramaticoComponent } from './contenido/contenido-programatico/contenido-programatico.component';
import { SubseccionComponent } from './subseccion/subseccion/subseccion.component';

import { interceptorProvider } from './seguridad/interceptors/pro-interceptor.service';
import { StompConfig } from '@stomp/stompjs';

// Definición de rutas
const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'categorias', component: CategoriaComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'registro', component: RegistroComponent },
  { path: 'inicio', component: IndexComponent },
  { path: 'curso/:nombreCategoria', component: CuerpoComponent },
  { path: 'programa', component: ContenidoProgramaticoComponent },
  { path: 'detalle/:id', component: DetalleContenidoComponent },
  { path: 'chat/:userId', loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent)},
  { path: 'carrito', component: CarritoComponent },
  { path: '**', redirectTo: '/inicio' },
];

@NgModule({
  declarations: [
    AppComponent,
    CategoriaComponent,
    FormCategoriaComponent,
    FormContenidoComponent,
    FooterComponent,
    LoginComponent,
    RegistroComponent,
    IndexComponent,
    EncabezadoComponent,
    CuerpoComponent,
    CarritoComponent,
    EstrellaComponent,
    DetalleContenidoComponent,
    ContenidoProgramaticoComponent,
    SubseccionComponent, // Declarar SubseccionComponent aquí
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    QuillModule.forRoot(), 
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AuthModule.forRoot({
      domain: 'dev-raf1r7abq103mk71.us.auth0.com',
      clientId: 'YMbmAKbkQTzZjCgSP9DUIODlDsKFV5Bt',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
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
  bootstrap: [AppComponent]
})
export class AppModule {}
