package Plantilla.apirest.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // definiciones de beans y se utilizará en la configuración de la aplicación.
public class Config {
    @Bean // Se aplica a un método dentro de una clase con @Configuration y define un
          // bean(modelMapper()) en el contexto de Spring
    public ModelMapper modelMapper() {
        return new ModelMapper();// Inyección ModelMapper() en otras clases que lo necesiten.
    }
}
