import * as categoriasRepository from '../repositories/categorias.repository.js';

export async function listarCategorias() {
  return categoriasRepository.listar();
}
