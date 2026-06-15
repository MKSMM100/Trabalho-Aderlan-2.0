import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

export const getResumo = (mes, ano) =>
  api.get('/resumo', { params: { mes, ano } }).then((res) => res.data);

export const getTransacoes = (mes, ano) =>
  api.get('/transacoes', { params: { mes, ano } }).then((res) => res.data);

export const getCategorias = () => api.get('/categorias').then((res) => res.data);

export const criarTransacao = (dados) =>
  api.post('/transacoes', dados).then((res) => res.data);

export const atualizarTransacao = (id, dados) =>
  api.put(`/transacoes/${id}`, dados).then((res) => res.data);

export const removerTransacao = (id) => api.delete(`/transacoes/${id}`);

export default api;
