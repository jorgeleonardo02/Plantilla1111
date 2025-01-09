package Plantilla.apirest.models.entity;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

@Converter
public class ContenidoJsonConverter implements AttributeConverter<ContenidoJson, String> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(ContenidoJson attribute) {
        try {
            return objectMapper.writeValueAsString(attribute); // Convierte el objeto a JSON.
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing ContenidoJson", e);
        }
    }

    @Override
    public ContenidoJson convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, ContenidoJson.class); // Convierte el JSON a objeto.
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error deserializing ContenidoJson", e);
        }
    }
}
