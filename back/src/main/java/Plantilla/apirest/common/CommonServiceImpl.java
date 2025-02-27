package Plantilla.apirest.common;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;

public class CommonServiceImpl<E, IRepositorio extends PagingAndSortingRepository<E, Long>>
		implements ICommonService<E> {

	private final IRepositorio iRepositorio;

	public CommonServiceImpl(IRepositorio iRepositorio) {
		this.iRepositorio = iRepositorio;
	}

	@Override
	@Transactional(readOnly = true)
	public List<E> listarElementos() {
		return (List<E>) iRepositorio.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public Page<E> listarElementosPaginado(Pageable paginador) {
		return iRepositorio.findAll(paginador);
	}

	@Override
	@Transactional(readOnly = true)
	public E obtenerElementoPorID(Long id) {
		return iRepositorio.findById(id).orElse(null);
	}

	@Override
	public E guardarElemento(E entity) {
		return iRepositorio.save(entity);
	}

	@Override
	public void eliminarElemento(Long id) {
		iRepositorio.deleteById(id);
	}

}

