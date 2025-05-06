package Plantilla.apirest.service;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Plantilla.apirest.models.dao.INodoContenidoRepository;
import Plantilla.apirest.models.dto.NodoContenidoDTO;
import Plantilla.apirest.models.entity.NodoContenido;
import Plantilla.apirest.models.mapper.NodoContenidoMapper;

@Service
public class NodoContenidoServiceImpl implements INodoContenidoService {
    @Autowired
    private INodoContenidoRepository repo;

    @Override
    public NodoContenido guardar(NodoContenido nodo) {
        return repo.save(nodo);
    }

    @Override
    public List<NodoContenido> obtenerTodos() {
        return repo.findAll();
    }

    @Override
    public NodoContenido obtenerPorId(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<NodoContenidoDTO> obtenerNodosRaiz() {
        return repo.findByPadreIsNull()
            .stream()
            .map(NodoContenidoMapper::toDTO)
            .collect(Collectors.toList());
    }

    /* @Override
    public NodoContenidoDTO guardarNodo(NodoContenidoDTO dto) {
        NodoContenido entity = NodoContenidoMapper.toEntity(dto);
        NodoContenido guardado = repo.save(entity);
        return NodoContenidoMapper.toDTO(guardado);
    } */

    @Override
    @Transactional
    public NodoContenidoDTO guardarNodo(NodoContenidoDTO dto) {
        NodoContenido entity = NodoContenidoMapper.toEntity(dto);
        
        if (entity.getId() != null && repo.existsById(entity.getId())) {
            // Ya existe, entonces actualizamos (save en JPA sobreescribe)
            NodoContenido actualizado = repo.save(entity);
            return NodoContenidoMapper.toDTO(actualizado);
        } else {
            // Nuevo nodo
            NodoContenido guardado = repo.save(entity);
            return NodoContenidoMapper.toDTO(guardado);
        }
    }

    @Override
    public NodoContenidoDTO obtenerDTOPorId(Long id) {
        return repo.findById(id)
                .map(NodoContenidoMapper::toDTO)
                .orElse(null);
    }

    
}
