package Plantilla.apirest.controllers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import Plantilla.apirest.service.IAlmacenamientoDeArchivos;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("media")
@AllArgsConstructor
public class ArchivosController {
    private final IAlmacenamientoDeArchivos almacenamientoServicio = null;
    private final HttpServletRequest request = null;
    private final Logger log = LoggerFactory.getLogger(getClass());

    @PostMapping("subir")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> guardarArchivo(@RequestParam("file") MultipartFile multipartFile) {// metodo para subir
                                                                                                  // cualquier archivo
        Map<String, String> map = new HashMap<>();
        String path = almacenamientoServicio.almacenamiento(multipartFile);
        String host = request.getRequestURL().toString().replace(request.getRequestURI(), "");
        String url = UriComponentsBuilder
                .fromHttpUrl(host)
                .path("/media/")
                .path(path)
                .toUriString();
        map.put("url", url);
        return map;
    }

    // recuperar un archivo
    @GetMapping("{nombreArchivo:.+}")
    // +@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> obtenerArchivo(@PathVariable String nombreArchivo) throws IOException {
        Resource archivo = almacenamientoServicio.cargarComoRecurso(nombreArchivo);
        String tipoContenido = Files.probeContentType(archivo.getFile().toPath());
        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE, tipoContenido)
                .body(archivo);
    }

    @GetMapping("/image")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> getImage() throws IOException {
        /*
         * Path path = Paths.get("../../../../../almacenamiento archivos/leo.png");
         * File file = new File("../../../../../almacenamiento archivos/leo.png");
         */
        Path path = Paths.get("C:/Users/jorgeleonardo/Desktop/Plantilla proyecto/almacenamiento archivos/leo.png");
        File file = new File("C:/Users/jorgeleonardo/Desktop/Plantilla proyecto/almacenamiento archivos/leo.png");
        if (file.exists()) {
            log.info("la imagen existe en la ruta especificada");
        } else {
            log.info("la imagen no existe en la ruta especificada");
        }
        byte[] imageBytes = Files.readAllBytes(path);
        HttpHeaders headers = new HttpHeaders();
        // headers.setContentType(MediaType.IMAGE_JPEG);
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentLength(imageBytes.length);
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

}
