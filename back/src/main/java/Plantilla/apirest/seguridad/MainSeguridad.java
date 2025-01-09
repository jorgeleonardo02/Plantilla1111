/* package Plantilla.apirest.seguridad;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
import Plantilla.apirest.seguridad.jwt.JwtEntryPoint;
import Plantilla.apirest.seguridad.jwt.JwtTokenFilter;
import Plantilla.apirest.seguridad.servicio.UserDetailsServicioImpl;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true) // a que metodos accede el administrador
public class MainSeguridad extends WebSecurityConfigurerAdapter {

    @Autowired
    UserDetailsServicioImpl userDetailsServiceImpl;

    @Autowired
    JwtEntryPoint jwtEntryPoint;// Devuelve el mensaje de no autorizado

    @Bean
    public JwtTokenFilter jwtTokenFilter() {
        return new JwtTokenFilter();
    }

    // Para la contraseña
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Se generan los methodos los 4 primeros
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsServiceImpl).passwordEncoder(passwordEncoder());// obtiene el usuario y se le
                                                                                           // cifra la contraseña
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    // Parte mas importante donde se configura todo

    @Override
protected void configure(HttpSecurity http) throws Exception {
    http.cors().and().csrf().disable() // deshabilitar cookies y CSRF
            .authorizeRequests()
            .antMatchers("/auth/**").permitAll()
            .antMatchers("/api/categorias").permitAll()
            .antMatchers("/media/subir").hasRole("ADMIN")
            .antMatchers("/media/image").permitAll()
            .antMatchers("/media/{nombreArchivo}").permitAll()
            .antMatchers("/api/contenidos").permitAll()
            .antMatchers("/api/contenidos/contenidoFoto/{id}").permitAll()
            .antMatchers("/api/contenidos/categoria/{id}").permitAll()
            .antMatchers("/api/contenidos/pagina").permitAll()
            .antMatchers("/api/contenidos/categoria/{id}/pagina").permitAll()
            .antMatchers("/api/contenidos/categoria/nombre/{nombreCategoria}/titulo").permitAll()
            .regexMatchers(HttpMethod.GET, "/api/contenidos/categoria/nombre/activado/[^/]+/titulo.*\\?activado=true.*").permitAll()
            .regexMatchers(HttpMethod.GET, "/api/contenidos/categoria/nombre/activado/[^/]+/mostrarTodos/titulo.*\\?mostrarTodos=true.*").hasAnyRole("ADMIN", "DOCENTE")
            .and()
            .addFilterBefore(new QueryParamAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
            .anyRequest().authenticated()
            .and()
            .exceptionHandling().authenticationEntryPoint(jwtEntryPoint)
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and().formLogin().disable();
    http.addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
}
 */

/*
 * @Override
 * protected void configure(HttpSecurity http) throws Exception {
 * http.cors().and().csrf().disable() // se deshabilitan las cookies
 * .authorizeRequests()// autorizar request
 * .antMatchers("/auth/**").permitAll() // Se le permite a todo el mundo el
 * acceso a la URL "/auth/**", ya
 * // que ahí está el login como el registrar usuario
 * .antMatchers("/api/categorias").permitAll()
 * .antMatchers("/media/subir").hasRole("ADMIN")
 * .antMatchers("/media/image").permitAll()
 * .antMatchers("/media/{nombreArchivo}").permitAll()
 * .antMatchers("/api/contenidos").permitAll()
 * // .antMatchers("/api/contenidos/pag").permitAll()
 * .antMatchers("/api/contenidos/contenidoFoto/{id}").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}").permitAll()
 * .antMatchers("/api/contenidos/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}/pagina").permitAll()
 * // .antMatchers("/api/contenidos/categoria/{id}/titulo").permitAll()
 * // .antMatchers(
 * "/api/contenidos/categoria/nombre/activado/{nombreCategoria}/titulo").
 * permitAll()
 * .antMatchers("/api/contenidos/categoria/nombre/{nombreCategoria}/titulo").
 * permitAll()
 * .regexMatchers(
 * "/api/contenidos/categoria/nombre/activado/[^/]+/titulo.*\\?activado=true.*")
 * .permitAll()
 * // .regexMatchers(
 * "/api/contenidos/categoria/nombre/[^/]+/activado/titulo.*\\?activado=true.*")
 * .permitAll()
 * // .regexMatchers(
 * //
 * "/api/contenidos/categoria/nombre/activado/[^/]+/mostrarTodos/titulo.*\\?mostrarTodos=true.*")
 * // .permitAll()
 * // .regexMatchers(
 * //
 * "/api/contenidos/categoria/nombre/activado/[^/]+/mostrarTodos/titulo.*\\?activado=true.*")
 * // .permitAll()
 * // .regexMatchers(
 * //
 * "/api/contenidos/categoria/nombre/activado/[^/]+/mostrarTodos/titulo.*\\?mostrarTodos=true.*")
 * // .hasAnyRole("ADMIN", "DOCENTE")
 * // .regexMatchers(
 * //
 * "/api/contenidos/categoria/nombre/activado/[^/]+/mostrarTodos/titulo.*\\?activado=false.*")
 * // .hasAnyRole("ADMIN", "DOCENTE")
 * // For URLs that match the pattern and have "activado=true" in the query
 * string
 * // For URLs that match the pattern and have "activado=true" in the query
 * string
 * // Restringir el acceso a las solicitudes que contengan "mostrarTodos=true"
 * solo
 * // para roles "ADMIN" y "DOCENTE"
 *
 * regexMatchers(HttpMethod.GET,
 * "/api/contenidos/categoria/nombre/activado/[^/]+/mostrarTodos/titulo.*\\?mostrarTodos=true.*")
 * .hasAnyRole("ADMIN", "DOCENTE")
 * .and()
 * .addFilterBefore(new QueryParamAuthorizationFilter(),
 * UsernamePasswordAuthenticationFilter.class)
 *
 * .anyRequest().authenticated() // Cualquier otro tipo de request debe estar
 * autenticado
 * .and() // Para el control de sesiones
 * .exceptionHandling().authenticationEntryPoint(jwtEntryPoint) // Para el
 * manejo de errores se va a usar
 * // el error 401 no autorizado a través del
 * // método "authenticationEntryPoint"
 * .and()// Sesion
 * .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
 * .and().formLogin().disable(); // Se establecen políticas
 * // de la sesión. Se va a
 * // dejar sin estado
 * // (STATELESS) debido a que
 * // se usa TOKEN
 *
 * // se añade el jwtTokenFilter antes de cada petición. Allí se va a comprobar
 * el
 * // token y va a enviar el usuaro al contexto de autenticación
 * http.addFilterBefore(jwtTokenFilter(),
 * UsernamePasswordAuthenticationFilter.class);
 * }
 */
//}

package Plantilla.apirest.seguridad;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
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
import org.springframework.web.cors.CorsConfigurationSource;
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
                .antMatchers("/api/contenidos").permitAll()
                .antMatchers("/api/contenidos/contenidoFoto/{id}").permitAll()
                .antMatchers("/api/contenidos/categoria/{id}").permitAll()
                .antMatchers("/api/contenidos/pagina").permitAll()
                .antMatchers("/api/contenidos/categoria/{id}/pagina").permitAll()
                .antMatchers("/api/contenidos/categoria/nombre/{nombreCategoria}/titulo").permitAll()
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

/*
 * @Configuration
 * 
 * @EnableWebSecurity
 * 
 * @EnableGlobalMethodSecurity(prePostEnabled = true) // a que métodos accede el
 * administrador
 * public class MainSeguridad extends WebSecurityConfigurerAdapter {
 * 
 * @Autowired
 * UserDetailsServicioImpl userDetailsServiceImpl;
 * 
 * @Autowired
 * JwtEntryPoint jwtEntryPoint;
 * 
 * @Autowired
 * JwtProvider jwtProvider;
 * 
 * @Bean
 * public JwtTokenFilter jwtTokenFilter() {
 * return new JwtTokenFilter();
 * }
 * 
 * // Para la contraseña
 * 
 * @Bean
 * public PasswordEncoder passwordEncoder() {
 * return new BCryptPasswordEncoder();
 * }
 * 
 * // Se generan los métodos los 4 primeros
 * 
 * @Override
 * protected void configure(AuthenticationManagerBuilder auth) throws Exception
 * {
 * auth.userDetailsService(userDetailsServiceImpl).passwordEncoder(
 * passwordEncoder());// obtiene el usuario y se le
 * // cifra la contraseña
 * }
 * 
 * @Bean
 * 
 * @Override
 * public AuthenticationManager authenticationManagerBean() throws Exception {
 * return super.authenticationManagerBean();
 * }
 * 
 * @Override
 * protected AuthenticationManager authenticationManager() throws Exception {
 * return super.authenticationManager();
 * }
 */
/*
 * @Override
 * protected void configure(HttpSecurity http) throws Exception {
 * http.cors().and().csrf().disable() // se deshabilitan las cookies
 * .authorizeRequests()// autorizar request
 * // Se le permite a todo el mundo el acceso a la URL "/auth/**", ya que ahí
 * está
 * // el login como el registrar usuario
 * .antMatchers("/auth/**").permitAll()
 * .antMatchers("/api/categorias").permitAll()
 * .antMatchers("/media/subir").hasRole("ADMIN")
 * .antMatchers("/api/clientes").permitAll()
 * .antMatchers("/media/image").permitAll()
 * .antMatchers("/media/{nombreArchivo}").permitAll()
 * .antMatchers("/api/contenidos").permitAll()
 * .antMatchers("/api/contenidos/contenidoFoto/{id}").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}").permitAll()
 * .antMatchers("/api/contenidos/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}/titulo").permitAll()
 * .antMatchers("/api/contenidos/categoria/nombre/{nombreCategoria}/titulo").
 * permitAll()
 * .anyRequest().authenticated() // Cualquier otro tipo de request debe estar
 * autenticado
 * .and() // Para el control de sesiones
 * .exceptionHandling().authenticationEntryPoint(jwtEntryPoint) // Para el
 * manejo de errores se va a usar
 * // el error 401 no autorizado a través del
 * // método "authenticationEntryPoint"
 * .and()// Sesion
 * .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
 * .and().formLogin().disable(); // Se establecen políticas
 * // de la sesión. Se va a
 * // dejar sin estado
 * // (STATELESS) debido a que
 * // se usa TOKEN
 * 
 * // se añade el jwtTokenFilter antes de cada petición. Allí se va a comprobar
 * el
 * // token y va a enviar el usuaro al contexto de autenticación
 * http.addFilterBefore(jwtTokenFilter(),
 * UsernamePasswordAuthenticationFilter.class);
 * }
 * }
 */

/*
 * @Override
 * protected void configure(HttpSecurity http) throws Exception {
 * http.cors().and().csrf().disable() // deshabilitar cookies y CSRF
 * .authorizeRequests()
 * .antMatchers("/auth/**").permitAll()
 * // .antMatchers("/auth/login").permitAll()
 * .antMatchers("/api/categorias").permitAll()
 * .antMatchers("/api/usuario/onombre/docente").permitAll()
 * .antMatchers("/api/usuario/nombre/**").permitAll()
 * .antMatchers("/media/subir").hasRole("ADMIN")
 * .antMatchers("/media/image").permitAll()
 * .antMatchers("/media/{nombreArchivo}").permitAll()
 * .antMatchers("/api/contenidos").permitAll()
 * .antMatchers("/api/contenidos/contenidoFoto/{id}").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}").permitAll()
 * .antMatchers("/api/contenidos/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/nombre/{nombreCategoria}/titulo").
 * permitAll()
 * .and()
 * .exceptionHandling().authenticationEntryPoint(jwtEntryPoint)
 * .and()
 * .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
 * .and().formLogin().disable();
 * http.addFilterBefore(jwtTokenFilter(),
 * UsernamePasswordAuthenticationFilter.class);
 * }
 */

/*
 * @Bean
 * public CorsConfigurationSource corsConfigurationSource() {
 * CorsConfiguration configuration = new CorsConfiguration();
 * configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
 * configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE",
 * "OPTIONS"));
 * configuration.setAllowedHeaders(Arrays.asList("authorization",
 * "content-type", "x-auth-token"));
 * configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
 * UrlBasedCorsConfigurationSource source = new
 * UrlBasedCorsConfigurationSource();
 * source.registerCorsConfiguration("/**", configuration);
 * return source;
 * }
 */
/*
 * @Bean
 * public CorsFilter corsFilter() {
 * UrlBasedCorsConfigurationSource source = new
 * UrlBasedCorsConfigurationSource();
 * CorsConfiguration config = new CorsConfiguration();
 * config.setAllowCredentials(true);
 * config.setAllowedOrigins(Arrays.asList("http://localhost:4200")); // Ajusta
 * los orígenes permitidos según sea
 * // necesario
 * config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control",
 * "Content-Type"));
 * config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE",
 * "OPTIONS"));
 * source.registerCorsConfiguration("/**", config);
 * return new CorsFilter(source);
 * }
 */
/*
 * @Override
 * protected void configure(HttpSecurity http) throws Exception {
 * http.cors().and().csrf().disable()
 * .authorizeRequests()
 * .antMatchers("/auth/**").permitAll()
 * .antMatchers("/api/categorias").permitAll()
 * .antMatchers("/api/usuario/onombre/docente").permitAll()
 * .antMatchers("/media/subir").hasRole("ADMIN")
 * .antMatchers("/media/image").permitAll()
 * .antMatchers("/media/{nombreArchivo}").permitAll()
 * .antMatchers("/api/contenidos").permitAll()
 * .antMatchers("/api/contenidos/contenidoFoto/{id}").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}").permitAll()
 * .antMatchers("/api/contenidos/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/nombre/{nombreCategoria}/titulo").
 * permitAll()
 * .and()
 * .exceptionHandling().authenticationEntryPoint(jwtEntryPoint)
 * .and()
 * .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
 * .and().formLogin().disable();
 * 
 * http.addFilterBefore(jwtTokenFilter(),
 * UsernamePasswordAuthenticationFilter.class);
 * }
 * 
 * @Bean
 * public CorsFilter corsFilter() {
 * UrlBasedCorsConfigurationSource source = new
 * UrlBasedCorsConfigurationSource();
 * CorsConfiguration config = new CorsConfiguration();
 * config.setAllowCredentials(true);
 * config.setAllowedOrigins(Arrays.asList("http://localhost:4200")); // Ajusta
 * los orígenes permitidos según sea
 * // necesario
 * config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control",
 * "Content-Type"));
 * config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE",
 * "OPTIONS"));
 * source.registerCorsConfiguration("/**", config);
 * return new CorsFilter(source);
 * }
 * }
 */
// }
// Parte más importante donde se configura todo

/*
 * @Override
 * protected void configure(HttpSecurity http) throws Exception {
 * http.cors().and().csrf().disable() // deshabilitar cookies y CSRF
 * .authorizeRequests()
 * .antMatchers("/auth/**").permitAll()
 * .antMatchers("/api/categorias").permitAll()
 * .antMatchers("/media/subir").hasRole("ADMIN")
 * .antMatchers("/media/image").permitAll()
 * .antMatchers("/media/{nombreArchivo}").permitAll()
 * .antMatchers("/api/contenidos").permitAll()
 * .antMatchers("/api/contenidos/contenidoFoto/{id}").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}").permitAll()
 * .antMatchers("/api/contenidos/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/nombre/{nombreCategoria}/titulo").
 * permitAll()
 * .regexMatchers(HttpMethod.GET,
 * "/api/contenidos/categoria/nombre/activado/[^/]+/titulo.*\\?activado=true.*")
 * .permitAll()
 *
 * // .and()
 * // .authorizeRequests()
 *
 * .regexMatchers(HttpMethod.GET,
 * "/api/contenidos/categoria/nombre/activado/[^/]+/mostrarTodos/titulo.*\\?mostrarTodos=true.*")
 * .hasAnyRole("ADMIN")
 * .and()
 * // .addFilterBefore(new QueryParamAuthorizationFilter(),
 * // UsernamePasswordAuthenticationFilter.class)
 * .addFilterBefore(jwtTokenFilter(),
 * UsernamePasswordAuthenticationFilter.class) // <-- Mover esta línea
 * // aquí
 * // .addFilterBefore(new QueryParamAuthorizationFilter(),
 * // UsernamePasswordAuthenticationFilter.class) // <--
 * // Y
 * // esta
 * // línea
 * // después
 * .exceptionHandling().authenticationEntryPoint(jwtEntryPoint)
 * .and()
 * .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
 * .and().formLogin().disable();
 * http.addFilterBefore(jwtTokenFilter(),
 * UsernamePasswordAuthenticationFilter.class);
 * }
 * }
 */

/*
 * @Override
 * protected void configure(HttpSecurity http) throws Exception {
 * http.cors().and().csrf().disable()
 * .authorizeRequests()
 * .antMatchers("/auth/**").permitAll()
 * .antMatchers("/api/categorias").permitAll()
 * .antMatchers("/media/subir").hasRole("ADMIN")
 * .antMatchers("/media/image").permitAll()
 * .antMatchers("/media/{nombreArchivo}").permitAll()
 * .antMatchers("/api/contenidos").permitAll()
 * .antMatchers("/api/contenidos/contenidoFoto/{id}").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}").permitAll()
 * .antMatchers("/api/contenidos/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/nombre/{nombreCategoria}/titulo").
 * permitAll()
 * .regexMatchers(HttpMethod.GET,
 * "/api/contenidos/categoria/nombre/activado/[^/]+/titulo.*\\?activado=true.*")
 * .permitAll()
 *
 * .regexMatchers(HttpMethod.GET,
 * "/api/contenidos/categoria/nombre/activado/[^/]+/mostrarTodos/titulo.*\\?mostrarTodos=true.*")
 * .hasAnyRole("ADMIN")
 * .and()
 *
 * .addFilterBefore(new JwtTokenFilter(jwtProvider, userDetailsServiceImpl),
 * UsernamePasswordAuthenticationFilter.class)
 * .addFilterBefore(new QueryParamAuthorizationFilter(), JwtTokenFilter.class)
 * // Ajustar el orden aquí
 * .exceptionHandling().authenticationEntryPoint(jwtEntryPoint)
 * .and()
 * .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
 * .and().formLogin().disable();
 * }
 *
 * }
 */

/*
 * @Configuration
 *
 * @EnableWebSecurity
 * public class MainSeguridad extends WebSecurityConfigurerAdapter {
 *
 * @Autowired
 * private JwtEntryPoint jwtEntryPoint;
 *
 * @Autowired
 * private JwtProvider jwtProvider;
 *
 * @Autowired
 * private UserDetailsServicioImpl userDetailsServiceImpl;
 *
 * @Bean
 * public JwtTokenFilter jwtTokenFilter() {
 * return new JwtTokenFilter();
 * }
 *
 * @Override
 * protected void configure(HttpSecurity http) throws Exception {
 * http.cors().and().csrf().disable() // deshabilitar cookies y CSRF
 * .authorizeRequests()
 * .antMatchers("/auth/**").permitAll()
 * .antMatchers("/api/categorias").permitAll()
 * .antMatchers("/media/subir").hasRole("ADMIN")
 * .antMatchers("/media/image").permitAll()
 * .antMatchers("/media/{nombreArchivo}").permitAll()
 * .antMatchers("/api/contenidos").permitAll()
 * .antMatchers("/api/contenidos/contenidoFoto/{id}").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}").permitAll()
 * .antMatchers("/api/contenidos/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/{id}/pagina").permitAll()
 * .antMatchers("/api/contenidos/categoria/nombre/{nombreCategoria}/titulo").
 * permitAll()
 * .regexMatchers(HttpMethod.GET,
 * "/api/contenidos/categoria/nombre/activado/[^/]+/titulo.*\\?activado=true.*")
 * .permitAll()
 *
 * .regexMatchers(HttpMethod.GET,
 * "/api/contenidos/categoria/nombre/activado/[^/]+/mostrarTodos/titulo.*\\?mostrarTodos=true.*")
 * .hasAnyRole("ADMIN")
 * .and()
 *
 * .addFilterBefore(jwtTokenFilter(),
 * UsernamePasswordAuthenticationFilter.class)
 * .addFilterBefore(new QueryParamAuthorizationFilter(),
 * UsernamePasswordAuthenticationFilter.class)
 * .exceptionHandling().authenticationEntryPoint(jwtEntryPoint)
 * .and()
 * .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
 * .and().formLogin().disable();
 * http.addFilterBefore(jwtTokenFilter(),
 * UsernamePasswordAuthenticationFilter.class);
 * }
 * }
 */