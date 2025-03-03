import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { NuevoUsuario } from '../modeloAcceso/nuevo-usuario';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent implements OnInit {
 
  nuevoUsuario: NuevoUsuario = new NuevoUsuario();
  nombre: string;
  //nombreUsuario: string;
  correo: string;
  password: string;
  listaRoles = ['DOCENTE', 'ESTUDIANTE' ,'VISITANTE', 'GERENCIA'];
  errMsj: string;
  camposFormulario: FormGroup;
  public eventoCheckbox: boolean = false;
  mostrarLimiteCursos: boolean = false;

  constructor(public tokenService: TokenService,
              private authService: AuthService,
              private router: Router,
              private constructorFormulario: FormBuilder,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.Creaformulario();
    console.log(this.nuevoUsuario);
  }

   // Al darle en checked puede ver la contraseña
   /* EventoCheckboxPassword(evento:any){
    this.eventoCheckbox = evento;
  } */

  // Crea formulario
  Creaformulario(){
    this.camposFormulario = this.constructorFormulario.group({
      nombre: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required],
      correo: ['', Validators.email],
      roles: ['VISITANTE',Validators.required],
      limiteCursos: [{ value: 5, disabled: true }] // Deshabilitamos el campo por defecto
    });
  }
  onRolSelectionChange(event: MatSelectChange) {
    const rolSeleccionado = event.value as string;
    this.mostrarLimiteCursos = rolSeleccionado === 'DOCENTE';
    const limiteCursosControl = this.camposFormulario.get('limiteCursos');
    
    if (this.mostrarLimiteCursos) {
      limiteCursosControl?.enable();
    } else {
      limiteCursosControl?.disable();
    }
  }

  // Se registra en nuevo usuario
  Registrar(): void {

    this.nuevoUsuario = this.camposFormulario.value;
    // Se convierte roles a array 
    let rol = [];
    rol.push(this.camposFormulario.get('roles')?.value);
    console.log("rol "+rol); 
    this.nuevoUsuario.roles = rol;
    console.log("this.nuevoUsuarioLeo: ");
    console.log(this.nuevoUsuario);
    this.authService.nuevo(this.nuevoUsuario).subscribe(
      
      data => {
        console.log("data");
        console.log(data);
        this.toastr.success('Cuenta Creada', 'OK', {
          timeOut: 5000, positionClass: 'toast-top-center'
        });
        //this.router.navigate(['/inicio']);
      },
      err => {
        this.errMsj = err.error.mensaje;
        this.toastr.error(this.errMsj, 'Fail', {
          timeOut: 5000,  positionClass: 'toast-top-center',
        });
        //this.router.navigate(['/inicio']);
        window.localStorage.clear(); // Limpia lo que tengamos en sesion storage
      }
    );
    this.router.navigate(['/inicio']);
  }
}