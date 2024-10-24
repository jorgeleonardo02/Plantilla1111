package Plantilla.apirest.rta;

import java.util.List;

public class RespuestaDatos {
    private List<?> datos;
    private boolean exitoso;
    private String mensaje;

    public RespuestaDatos() {
    }

    public RespuestaDatos(List<?> datos, boolean exitoso, String mensaje) {
        this.datos = datos;
        this.exitoso = exitoso;
        this.mensaje = mensaje;
    }

    public void setDatos(List<?> datos) {
        this.datos = datos;
    }

    public List<?> getDatos() {
        return this.datos;
    }

    public void setExitoso(boolean exitoso) {
        this.exitoso = exitoso;
    }

    public boolean getExitoso() {
        return this.exitoso;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getMensaje() {
        return this.mensaje;
    }
}
