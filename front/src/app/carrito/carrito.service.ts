import { Injectable } from '@angular/core';
import { Curso } from '../curso/curso';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from '../seguridad/service/token.service';

@Injectable({
  providedIn: 'root'
})

export class CarritoService {
  private claveCarrito = 'carrito';
  private claveTiempoGuardado = 'tiempoGuardado';
  private tiempoExpiracion = 2*24*60*60*1000; // 3 días en milisegundos
  
  private carrito = new BehaviorSubject<Curso[]>([]);
  carrito$ = this.carrito.asObservable();

  constructor(private tokenService: TokenService) {
    this.reiniciarCarritoSiExpirado();
    this.carrito.next(this.obtenerCarritoActual());
  }

  agregarAlCarrito(curso: Curso): void {
    const carritoActual = this.carrito.getValue();
    const existeEnCarrito = carritoActual.some(item => item.id === curso.id);

    if ((!existeEnCarrito) && (!this.tokenService.logueado() || this.tokenService.rolVisitante() || this.tokenService.rolEstudiante())) {
      const nuevoCarrito = [...carritoActual, curso];
      this.actualizarCarrito(nuevoCarrito);
    } else {
      console.log('El contenido ya está en el carrito');
    }
  }

  limpiarCarrito(): void {
    localStorage.removeItem(this.claveCarrito);
    localStorage.removeItem(this.claveTiempoGuardado);
    this.carrito.next([]);
  }

  public obtenerCarritoActual(): Curso[] {
    const carritoGuardado = localStorage.getItem(this.claveCarrito);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  actualizarCarrito(carrito: Curso[]): void {
    localStorage.setItem(this.claveCarrito, JSON.stringify(carrito));
    this.carrito.next(carrito);
    this.actualizarTiempoGuardado();
  }

  private actualizarTiempoGuardado(): void {
    localStorage.setItem(this.claveTiempoGuardado, new Date().toISOString());
  }

  private reiniciarCarritoSiExpirado(): void {
    const tiempoGuardado = localStorage.getItem(this.claveTiempoGuardado);

    if (tiempoGuardado) {
      const tiempoGuardadoMs = new Date(tiempoGuardado).getTime();
      const tiempoActualMs = new Date().getTime();

      if (tiempoActualMs - tiempoGuardadoMs > this.tiempoExpiracion) {
        this.limpiarCarrito();
      }
    }
  }
  
  public eliminarElementoDelCarrito(idElemento: number): void {
    const carritoActualString: string | null = localStorage.getItem(this.claveCarrito);

    if (carritoActualString !== null) {
      const carritoActual: Curso[] = JSON.parse(carritoActualString);
      
      const nuevoCarrito = carritoActual.filter(item => item.id !== idElemento);
      this.actualizarCarrito(nuevoCarrito);
    }
  }
  

  actualizarCarritoConNuevosCursos(nuevosCursos: Curso[]): void {
    const carritoActual = this.carrito.getValue();

    // Filtrar los elementos del carrito que no están en los nuevos contenidos
    const nuevoCarrito = carritoActual.filter(item => nuevosCursos.some(curso => curso.id === item.id));

    // Actualizar el carrito con los elementos restantes
    this.actualizarCarrito(nuevoCarrito);
  }
}