import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../service/token.service';
@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {
  constructor(private tokenService: TokenService,
              private router: Router) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.tokenService.logueado()) {
      this.router.navigate(['/']);
      return false; //Cuando esta logueado no muestra la pagina
    }
    return true;
  }
}
