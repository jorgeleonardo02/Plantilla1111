package Plantilla.apirest.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface IAlmacenamientoDeArchivos {
    void init();

    String almacenamiento(MultipartFile file);

    Resource cargarComoRecurso(String nombreArchivo);
}
