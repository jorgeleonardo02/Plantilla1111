package Plantilla.apirest.config;

/*
 * import org.springframework.context.annotation.Configuration;
 * import org.springframework.messaging.simp.config.MessageBrokerRegistry;
 * import org.springframework.web.socket.config.annotation.
 * EnableWebSocketMessageBroker;
 * import
 * org.springframework.web.socket.config.annotation.StompEndpointRegistry;
 * import org.springframework.web.socket.config.annotation.
 * WebSocketMessageBrokerConfigurer;
 * 
 * @Configuration
 * 
 * @EnableWebSocketMessageBroker
 * public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
 * 
 * @Override
 * public void configureMessageBroker(MessageBrokerRegistry config) {
 * config.enableSimpleBroker("/topic"); // Habilita el broker para enviar
 * mensajes a clientes suscritos
 * config.setApplicationDestinationPrefixes("/app"); // Configura el prefijo del
 * destino de la aplicación
 * }
 * 
 * @Override
 * public void registerStompEndpoints(StompEndpointRegistry registry) {
 * registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS(); // Define el
 * punto de conexión del WebSocket
 * }
 * }
 */

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // broker para cumunicacion con los clientes
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // habilitar lo que es un broker permite la comunicacion entre los clientes y
    // servidor
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");// path para ingresar al broker
        config.setApplicationDestinationPrefixes("/app");// Path destino de mensajes
    }

    // Registrar los empoint
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat-socket")// frond-end con que path conecta ami servidor socket
                .setAllowedOrigins("http://localhost:4200").withSockJS();// permisos clientes que se pueden conectar a
                                                                         // este empoint
    }
}
