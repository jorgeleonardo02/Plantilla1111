/* import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../../service/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth:TokenService,
              private router: Router){

  }
  //metodo que se llama cuando quieran entrar a la ruta
  //ruta a la que quieren entrar
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean  {
    if (this.auth.logueado()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
    
}
 */
