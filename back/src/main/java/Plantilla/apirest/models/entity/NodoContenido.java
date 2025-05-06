package Plantilla.apirest.models.entity;


import javax.persistence.*;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonBackReference;

/* @Entity
public class NodoContenido { // Clase que representa un nodo de contenido en la base de datos

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String path;

    @Lob // Para permitir contenido largo en HTML
    private String contenidoTexto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "padre_id")
    private NodoContenido padre;

    @OneToMany(mappedBy = "padre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NodoContenido> children; */

 /*    @Entity
public class NodoContenido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String path;

    @Lob
    private String contenidoTexto;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "padre_id")
    private NodoContenido padre;

    @JsonManagedReference
    @OneToMany(mappedBy = "padre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NodoContenido> children = new ArrayList<>();

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }

    public String getContenidoTexto() {
        return contenidoTexto;
    }

    public NodoContenido getPadre() {
        return padre;
    }

    public List<NodoContenido> getChildren() {
        return children;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setContenidoTexto(String contenidoTexto) {
        this.contenidoTexto = contenidoTexto;
    }

    public void setPadre(NodoContenido padre) {
        this.padre = padre;
    }

    public void setChildren(List<NodoContenido> children) {
        this.children = children;
        if (children != null) {
            for (NodoContenido hijo : children) {
                hijo.setPadre(this);
            }
        }
    }
} */


 @Entity
 @Data
 public class NodoContenido {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String path;
    private String numeroSeccion;
    //@Lob
    @Column(columnDefinition = "TEXT") // O LONGTEXT si usas MySQL
    private String contenidoTexto;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "padre_id")
    private NodoContenido padre;

    @JsonManagedReference
    @OneToMany(mappedBy = "padre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NodoContenido> children = new ArrayList<>();
 }