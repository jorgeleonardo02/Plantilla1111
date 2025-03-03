package Plantilla.apirest.seguridad;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import Plantilla.apirest.seguridad.jwt.JwtEntryPoint;
import Plantilla.apirest.seguridad.jwt.JwtProvider;
import Plantilla.apirest.seguridad.jwt.JwtTokenFilter;
import Plantilla.apirest.seguridad.servicio.UserDetailsServicioImpl;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class MainSeguridad extends WebSecurityConfigurerAdapter {

    @Autowired
    UserDetailsServicioImpl userDetailsServiceImpl;

    @Autowired
    JwtEntryPoint jwtEntryPoint;

    @Autowired
    JwtProvider jwtProvider;

    @Bean
    public JwtTokenFilter jwtTokenFilter() {
        return new JwtTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsServiceImpl).passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .authorizeRequests()
                .antMatchers("/auth/**").permitAll()
                .antMatchers("/api/categorias").permitAll()
                //.antMatchers("/api/secciones").permitAll()
                //.antMatchers("/api/subsecciones").permitAll()
                .antMatchers("/api/usuario/onombre/docente").permitAll()
                .antMatchers("/media/subir").hasRole("ADMIN")
                .antMatchers("/media/image").permitAll()
                .antMatchers("/media/{nombreArchivo}").permitAll()
                .antMatchers("/api/cursos").permitAll()
                .antMatchers("/api/cursos/cursoFoto/{id}").permitAll()
                .antMatchers("/api/cursos/categoria/{id}").permitAll()
                .antMatchers("/api/cursos/pagina").permitAll()
                .antMatchers("/api/cursos/categoria/{id}/pagina").permitAll()
                .antMatchers("/api/cursos/categoria/nombre/{nombreCategoria}/nombre").permitAll()
                .and()
                .exceptionHandling().authenticationEntryPoint(jwtEntryPoint)
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().formLogin().disable();

        http.addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200", "http://otro-origen-permitido.com")); // Ajusta
                                                                                                              // los
                                                                                                              // orígenes
                                                                                                              // permitidos
                                                                                                              // según
                                                                                                              // sea
                                                                                                              // necesario
        config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}