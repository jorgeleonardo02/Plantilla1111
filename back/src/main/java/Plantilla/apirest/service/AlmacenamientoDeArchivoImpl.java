package Plantilla.apirest.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AlmacenamientoDeArchivoImpl implements IAlmacenamientoDeArchivos {
    @Value("${ubicacion.archivos}") // se pasa la costante de properties
    private String ubicacionArchivos;

    private Path raizUbicacion;

    @PostConstruct
    public void init() {// asegurar que esa ruta o carpeta existe
        raizUbicacion = Paths.get(ubicacionArchivos);
        try {
            Files.createDirectories(raizUbicacion);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String almacenamiento(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException(" Archivo de almacenamiento esta vacio");
            }
            String nombreArchivo = file.getOriginalFilename();// obtenemeos el nombre original
            /*
             * String nombreArchivo = UUID.randomUUID().toString() + "_" +
             * file.getOriginalFilename();
             */
            Path rutaAlmacenamiento = raizUbicacion.resolve(Paths.get(nombreArchivo))
                    .normalize().toAbsolutePath();// lo almacenamos con la clase util files
            try (InputStream flujoEntrada = file.getInputStream()) {
                Files.copy(flujoEntrada, rutaAlmacenamiento, StandardCopyOption.REPLACE_EXISTING);
            }
            return nombreArchivo;
        } catch (IOException e) {
            throw new RuntimeException(" Fallo al almacenar archivo.", e);
        }

    }

    public Resource cargarComoRecurso(String nombreArchivo) {// recuperar archivo apartir de su nombre
        try {
            Path file = raizUbicacion.resolve(nombreArchivo);
            Resource recurso = new UrlResource(file.toUri());
            if (recurso.exists() || recurso.isReadable()) {
                return recurso;
            } else {
                throw new RuntimeException(" No se pudo leer el archivo" + nombreArchivo);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException(" No se pudo leer el archivo" + nombreArchivo);
        }
    }

}
