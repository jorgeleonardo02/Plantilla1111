package Plantilla.apirest.models.dto;

public class CursoUsuarioDto3 {

    private Long id;
    private CursoDto curso;

    // Constructor, getters y setters

    public CursoUsuarioDto3(Long id, CursoDto curso) {
        this.id = id;
        this.curso = curso;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CursoDto getCurso() {
        return curso;
    }

    public void setCurso(CursoDto curso) {
        this.curso = curso;
    }
}