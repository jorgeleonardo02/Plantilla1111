package Plantilla.apirest.controllers;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mercadopago.MercadoPago;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.Preference;
import com.mercadopago.resources.datastructures.preference.BackUrls;
import com.mercadopago.resources.datastructures.preference.Item;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Plantilla.apirest.models.entity.Curso;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Value("${mercadopago.access.token}")
    private String mpAccessToken;

    @PostMapping("/crear-preferencia")
    public ResponseEntity<?> crearPreferencia(@RequestBody List<Curso> cursos) throws MPException {

        // 1. Configurar el Access Token
        MercadoPago.SDK.setAccessToken(mpAccessToken);

        // 2. Crear la preferencia
        Preference preference = new Preference();

        // 3. Crear lista de items (DEBE ser ArrayList)
        ArrayList<Item> items = new ArrayList<>();

        for (Curso curso : cursos) {

            // MercadoPago dx-java 1.8.0 SOLO acepta Float
            float precioFinal = (float) (curso.getPrecio() * (1 + curso.getPorcentajeAdmin()));

            Item item = new Item()
                    .setTitle(curso.getNombre())
                    .setQuantity(1)
                    .setCurrencyId("COP")
                    .setUnitPrice(precioFinal); // <-- Debe ser Float

            items.add(item);
        }

        // Agregar items a la preferencia
        preference.setItems(items);

        // 4. Configurar URLs de retorno
        BackUrls backUrls = new BackUrls(
                "https://tu-front.com/pago-exitoso",
                "https://tu-front.com/pago-pendiente",
                "https://tu-front.com/pago-fallido"
        );

        preference.setBackUrls(backUrls);
        preference.setAutoReturn(Preference.AutoReturn.approved);

        // 5. Guardar la preferencia en MercadoPago
        Preference savedPreference = preference.save();

        // 6. Retornar el ID de la preferencia al frontend
        Map<String, String> response = new HashMap<>();
        response.put("preferenceId", savedPreference.getId());

        return ResponseEntity.ok(response);
    }
}