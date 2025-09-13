import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listaService } from '../services/listaService';
import './Home.css';

function Home() {
  const [user, setUser] = useState(null);
  const [listas, setListas] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const [deletingLists, setDeletingLists] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    if (!isAuthenticated || !userId) {
      navigate('/login');
      return;
    }

    setUser({ id: userId, nombre: userName });
    cargarDatosUsuario(userId);
  }, [navigate]);

  const cargarDatosUsuario = async (userId) => {
    try {
      setLoading(true);
      
      // Cargar listas del usuario
      const listasData = await listaService.obtenerListasUsuario(userId);
      setListas(listasData || []);

      // Cargar artículos del usuario
      const articulosData = await listaService.obtenerArticulosUsuario(userId);
      setArticulos(articulosData || []);

    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
      setError('Error al cargar tus listas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getArticulosParaLista = (listaId) => {
    return articulos.filter(articulo => 
      articulo.listas && articulo.listas.includes(listaId)
    );
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) {
      alert('Por favor, ingresa un nombre para la lista');
      return;
    }

    try {
      setCreatingList(true);
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const newList = {
        nombre: newListName.trim(),
        fechacreacion: today,
        usuario: parseInt(user.id)
      };

      await listaService.crearLista(newList);
      
      // Recargar datos del usuario para mostrar la nueva lista
      await cargarDatosUsuario(user.id);
      
      // Limpiar formulario y cerrar modal
      setNewListName('');
      setShowCreateModal(false);
      
    } catch (error) {
      console.error('Error creando lista:', error);
      alert('Error al crear la lista. Por favor, intenta de nuevo.');
    } finally {
      setCreatingList(false);
    }
  };

  const handleDeleteList = async (e, listaId, listaNombre) => {
    e.stopPropagation(); // Prevent navigation to detailed view
    
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la lista "${listaNombre}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeletingLists(prev => new Set(prev).add(listaId));
      
      await listaService.eliminarLista(listaId);
      
      // Recargar datos del usuario para actualizar la vista
      await cargarDatosUsuario(user.id);
      
    } catch (error) {
      console.error('Error eliminando lista:', error);
      alert('Error al eliminar la lista. Por favor, intenta de nuevo.');
    } finally {
      setDeletingLists(prev => {
        const newSet = new Set(prev);
        newSet.delete(listaId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Cargando tus listas...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="user-info">
          <h1>¡Bienvenido, {user?.nombre}!</h1>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="home-main">
        {error && <div className="error-message">{error}</div>}
        
        <section className="listas-section">
          <div className="listas-header">
            <h2>Tus Listas de Tareas</h2>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="create-list-btn"
            >
              + Nueva Lista
            </button>
          </div>
          
          {listas.length === 0 ? (
            <div className="no-lists">
              <p>Aún no tienes listas creadas.</p>
              <p>¡Crea tu primera lista para empezar a organizarte!</p>
            </div>
          ) : (
            <div className="listas-grid">
              {listas.map((lista) => {
                const articulosLista = getArticulosParaLista(lista.id);
                return (
                  <div 
                    key={lista.id} 
                    className="lista-card"
                    onClick={() => navigate(`/list/${lista.id}`)}
                  >
                    <div className="lista-header">
                      <div className="lista-title-section">
                        <h3>{lista.nombre}</h3>
                        <span className="fecha">Creada: {lista.fechacreacion}</span>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteList(e, lista.id, lista.nombre)}
                        className="delete-btn"
                        disabled={deletingLists.has(lista.id)}
                        title="Eliminar lista"
                      >
                        {deletingLists.has(lista.id) ? '...' : '×'}
                      </button>
                    </div>
                    
                    <div className="lista-content">
                      <p className="articulos-count">
                        {articulosLista.length} artículo{articulosLista.length !== 1 ? 's' : ''}
                      </p>
                      
                      {articulosLista.length > 0 && (
                        <div className="articulos-preview">
                          <h4>Artículos:</h4>
                          <ul className="articulos-list">
                            {articulosLista.slice(0, 3).map((articulo) => (
                              <li key={articulo.id} className="articulo-item">
                                <strong>{articulo.nombre}</strong>
                                {articulo.contenido && (
                                  <span className="articulo-contenido">
                                    : {articulo.contenido}
                                  </span>
                                )}
                              </li>
                            ))}
                            {articulosLista.length > 3 && (
                              <li className="more-items">
                                ... y {articulosLista.length - 3} más
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Modal para crear nueva lista */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Crear Nueva Lista</h3>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setNewListName('');
                }}
                className="modal-close-btn"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateList} className="modal-form">
              <div className="form-group">
                <label htmlFor="listName">Nombre de la lista:</label>
                <input
                  type="text"
                  id="listName"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Ej: Lista de compras, Tareas del trabajo..."
                  required
                  maxLength={100}
                  disabled={creatingList}
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewListName('');
                  }}
                  className="btn-cancel"
                  disabled={creatingList}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-create"
                  disabled={creatingList || !newListName.trim()}
                >
                  {creatingList ? 'Creando...' : 'Crear Lista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
