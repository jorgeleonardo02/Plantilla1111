package Plantilla.apirest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;

import Plantilla.apirest.service.IRepositorioService;

//@SpringBootApplication(scanBasePackages = "ICategoriasDao, IRepositorioService")

/* @SpringBootApplication(scanBasePackages = { "Plantilla.apirest.seguridad.servicio",
		"Plantilla.apirest.service", "Plantilla.apirest.seguridad.repositorio" */
/*
 * "Plantilla.apirest.models.dao.ICategoriasDao"
 *//* , */
/* "Plantilla.apirest.service.IRepositorioService" */ /* "Plantilla.apirest.service.CategoriaServiceImpl" */
/* }, exclude = JpaRepositoriesAutoConfiguration.class) */

@SpringBootApplication
public class PlantillaApplication implements CommandLineRunner {
	@Autowired
	IRepositorioService iRepositorioService;

	public static void main(String[] args) {
		SpringApplication.run(PlantillaApplication.class, args);
	}

	/**
	 * Este método se utilizará para el ambiente de desarrollo para que cada vez que
	 * se levante el servidor
	 * se eliminen los archivos existentes en el repositorio y se cree
	 * automáticamente la carpeta.
	 * En un ambiente de producción, es mejor que la carpeta quede fuera del
	 * proyecto
	 */
	@Override
	public void run(String... args) throws Exception {
		iRepositorioService.borrarTodo();
		iRepositorioService.iniciarRepositorio();

	}

}
