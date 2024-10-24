import { Injectable } from '@angular/core';
import { Contenido } from '../contenido/contenido';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from '../seguridad/service/token.service';

@Injectable({
  providedIn: 'root'
})

export class CarritoService {
  private claveCarrito = 'carrito';
  private claveTiempoGuardado = 'tiempoGuardado';
  private tiempoExpiracion = 2*24*60*60*1000; // 3 días en milisegundos
  
  private carrito = new BehaviorSubject<Contenido[]>([]);
  carrito$ = this.carrito.asObservable();

  constructor(private tokenService: TokenService) {
    this.reiniciarCarritoSiExpirado();
    this.carrito.next(this.obtenerCarritoActual());
  }

  agregarAlCarrito(contenido: Contenido): void {
    const carritoActual = this.carrito.getValue();
    const existeEnCarrito = carritoActual.some(item => item.id === contenido.id);

    if ((!existeEnCarrito) && (!this.tokenService.logueado() || this.tokenService.rolVisitante() || this.tokenService.rolEstudiante())) {
      const nuevoCarrito = [...carritoActual, contenido];
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

  public obtenerCarritoActual(): Contenido[] {
    const carritoGuardado = localStorage.getItem(this.claveCarrito);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  actualizarCarrito(carrito: Contenido[]): void {
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

  

  

  /* public eliminarElementoDelCarrito(idElemento: number): void {
    const carritoActual = this.carrito.getValue();
    const nuevoCarrito = carritoActual.filter(item => item.id !== idElemento);
    this.actualizarCarrito(nuevoCarrito);
  } */

  public eliminarElementoDelCarrito(idElemento: number): void {
    const carritoActualString: string | null = localStorage.getItem(this.claveCarrito);

    if (carritoActualString !== null) {
      const carritoActual: Contenido[] = JSON.parse(carritoActualString);
      
      const nuevoCarrito = carritoActual.filter(item => item.id !== idElemento);
      this.actualizarCarrito(nuevoCarrito);
    }
  }
  
 
  
  

  /* actualizarCarrito(nuevoCarrito: Contenido[]): void {
    this.carrito.next(nuevoCarrito);
  } */

  actualizarCarritoConNuevosContenidos(nuevosContenidos: Contenido[]): void {
    const carritoActual = this.carrito.getValue();

    // Filtrar los elementos del carrito que no están en los nuevos contenidos
    const nuevoCarrito = carritoActual.filter(item => nuevosContenidos.some(contenido => contenido.id === item.id));

    // Actualizar el carrito con los elementos restantes
    this.actualizarCarrito(nuevoCarrito);
  }
  /* eliminarContenidosBasadosEnRol(rol: string): void {
    const carritoActual = this.carrito.getValue();
    let nuevoCarrito: Contenido[] = carritoActual;

    if (rol === 'ROLE_ESTUDIANTE') {
      // Aquí puedes especificar la lógica para eliminar los contenidos específicos para los estudiantes
      nuevoCarrito = carritoActual.filter(item => !this.esContenidoParaEstudiantes(item));
    }

    this.actualizarCarrito(nuevoCarrito);
  }
  private esContenidoParaEstudiantes(contenido: Contenido): boolean {
    // Implementa la lógica para determinar si el contenido es para estudiantes
    return true; // Ejemplo: todos los contenidos son para estudiantes
  } */
  
}

/* export class CarritoService {
  private claveCarrito = 'carrito';
  private claveTiempoGuardado = 'tiempoGuardado';
  private tiempoExpiracion = 2*24*60*60*1000;//3 dias//3600000; // 1 hora en milisegundos 
  
  //private contenidoEnCarrito: Contenido[] = [];
  private carrito = new BehaviorSubject<Contenido[]>([]);//El Set
  carrito$ = this.carrito.asObservable(); //El Get

  constructor(private tokenService: TokenService) {
    // Al iniciar el servicio, verificar si es necesario reiniciar el carrito
    this.reiniciarCarritoSiExpirado();
    this.carrito.next(this.obtenerCarritoActual());
  }

  agregarAlCarrito(contenido: Contenido): void {
    const carritoActual = this.carrito.getValue();
    const existeEnCarrito = carritoActual.some(item => item.id === contenido.id);

    if ((!existeEnCarrito) && ( !this.tokenService.logueado() || this.tokenService.rolVisitante()  || this.tokenService.rolEstudiante())) {
      const nuevoCarrito = [...carritoActual, contenido];
      console.log("nuevoCarrito");
      console.log(nuevoCarrito);
      this.carrito.next(nuevoCarrito);
      this.actualizarCarrito(nuevoCarrito);
    } else {
      console.log('El contenido ya está en el carrito');
    }
  }

  // Limpiar el carrito
  limpiarCarrito(): void {
    localStorage.removeItem(this.claveCarrito);
    localStorage.removeItem(this.claveTiempoGuardado);
    this.carrito.next([]); // Limpiar carrito en BehaviorSubject
  }
  
  // Obtener el contenido actual del carrito
  private obtenerCarritoActual(): Contenido[] {
    const carritoGuardado = localStorage.getItem(this.claveCarrito);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }
  
  private actualizarCarrito(carrito: Contenido[]): void {
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
        // Ha pasado el tiempo, reiniciar el Local Storage
        this.limpiarCarrito();
      }
    }
  }

public eliminarElementoDelCarrito(idElemento: number): void {
  console.log("id local estorage:" +idElemento);
  // Obtener la lista actual del localStorage
  const carritoActualString: string | null = localStorage.getItem(this.claveCarrito);

  if (carritoActualString !== null) {
      // Convertir la cadena JSON a un array de objetos
      const carritoActual: Contenido[] = JSON.parse(carritoActualString);

      // Encontrar el índice del elemento a eliminar
      const indice = carritoActual.findIndex((elemento) => elemento.id === idElemento);

      if (indice !== -1) {
          // Eliminar el elemento del array
          carritoActual.splice(indice, 1);

          // Guardar la lista actualizada en el localStorage
          localStorage.setItem(this.claveCarrito, JSON.stringify(carritoActual));

          // Actualizar el BehaviorSubject si es necesario
          this.carrito.next(carritoActual);

          // Opcional: Actualizar el tiempo de guardado
          this.actualizarTiempoGuardado();
      } else {
          console.log('El elemento con el ID especificado no se encontró en el carrito.');
      }
  } else {
      console.log('No se encontró ninguna lista de carrito en el localStorage.');
  }
}
}
 */