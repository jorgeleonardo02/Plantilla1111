package Plantilla.apirest.config;
/*
* import org.springframework.context.annotation.Bean;
* import org.springframework.context.annotation.Configuration;
* //import org.springframework.web.servlet.config.annotation.CorsRegistry;
* //import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
* import org.springframework.web.filter.CorsFilter;
* import org.springframework.web.cors.CorsConfiguration;
* import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
* import org.springframework.web.cors.CorsConfigurationSource;
* import java.util.Arrays;
*
* @Configuration
*/

/* public class CorsConfig { */
/*
 * @Bean
 * public WebMvcConfigurer WebMvcConfigurer() {
 * return new WebMvcConfigurer() {
 *
 * @Override
 * public void addCorsMappings(CorsRegistry registry) {
 * registry.addMapping("/media/**")
 * .allowedOrigins("*")
 * .allowedMethods("*");
 * };
 * };
 * }
 */
/*
 * @Bean
 * public CorsFilter corsFilter() {
 * UrlBasedCorsConfigurationSource source = new
 * UrlBasedCorsConfigurationSource();
 * CorsConfiguration config = new CorsConfiguration();
 * config.setAllowCredentials(true);
 * config.addAllowedOrigin("*");
 * config.addAllowedHeader("*");
 * config.addAllowedMethod("OPTIONS");
 * config.addAllowedMethod("GET");
 * config.addAllowedMethod("POST");
 * config.addAllowedMethod("PUT");
 * config.addAllowedMethod("DELETE");
 * source.registerCorsConfiguration("/**", config);
 * return new CorsFilter(source);
 * }
 */
/*
 * @Bean
 * public CorsConfigurationSource corsConfigurationSource() {
 * CorsConfiguration configuration = new CorsConfiguration();
 * configuration.setAllowedOrigins(Arrays.asList("*"));
 * configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT",
 * "DELETE"));
 * UrlBasedCorsConfigurationSource source = new
 * UrlBasedCorsConfigurationSource();
 * source.registerCorsConfiguration("/**", configuration);
 * return source;
 * }
 */
/* } */

//package Plantilla.apirest.config;

/*
 * import org.springframework.context.annotation.Bean;
 * import org.springframework.context.annotation.Configuration;
 * import org.springframework.web.servlet.config.annotation.CorsRegistry;
 * import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
 * 
 * @Configuration
 * public class CorsConfig {
 * 
 * @Bean
 * public WebMvcConfigurer corsConfigurer() {
 * return new WebMvcConfigurer() {
 * 
 * @Override
 * public void addCorsMappings(CorsRegistry registry) {
 * registry.addMapping("/api/**")
 * .allowedOrigins("http://localhost:4200")
 * .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
 * .allowedHeaders("*")
 * .allowCredentials(true);
 * }
 * };
 * }
 * }
 */

/* import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
} */
/* import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
} */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}