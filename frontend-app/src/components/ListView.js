import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listaService } from '../services/listaService';
import { articuloService } from '../services/articuloService';
import './ListView.css';

function ListView() {
  const { listId } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [lista, setLista] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [allArticulos, setAllArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // List editing states
  const [isEditingList, setIsEditingList] = useState(false);
  const [editedListName, setEditedListName] = useState('');
  const [savingList, setSavingList] = useState(false);
  
  // Item management states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ nombre: '', contenido: '' });
  const [creatingItem, setCreatingItem] = useState(false);
  const [editingItems, setEditingItems] = useState(new Set());
  const [editedItems, setEditedItems] = useState({});
  const [deletingItems, setDeletingItems] = useState(new Set());

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
    cargarDatosLista(userId);
  }, [navigate, listId]);

  const cargarDatosLista = async (userId) => {
    try {
      setLoading(true);
      
      // Cargar todas las listas del usuario para encontrar la actual
      const listasData = await listaService.obtenerListasUsuario(userId);
      const listaActual = listasData.find(l => l.id === parseInt(listId));
      
      if (!listaActual) {
        setError('Lista no encontrada');
        return;
      }
      
      setLista(listaActual);
      setEditedListName(listaActual.nombre);

      // Cargar todos los artículos del usuario
      const articulosData = await listaService.obtenerArticulosUsuario(userId);
      setAllArticulos(articulosData || []);
      
      // Filtrar artículos de esta lista específica
      const articulosLista = articulosData.filter(articulo => 
        articulo.listas && articulo.listas.includes(parseInt(listId))
      );
      setArticulos(articulosLista);

    } catch (error) {
      console.error('Error cargando datos de la lista:', error);
      setError('Error al cargar la lista. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveListName = async () => {
    if (!editedListName.trim()) {
      alert('El nombre de la lista no puede estar vacío');
      return;
    }

    try {
      setSavingList(true);
      
      const updatedList = {
        ...lista,
        nombre: editedListName.trim()
      };

      await listaService.actualizarLista(lista.id, updatedList);
      
      // Actualizar estado local
      setLista(updatedList);
      setIsEditingList(false);
      
    } catch (error) {
      console.error('Error actualizando lista:', error);
      alert('Error al actualizar la lista. Por favor, intenta de nuevo.');
    } finally {
      setSavingList(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedListName(lista.nombre);
    setIsEditingList(false);
  };

  const handleGoBack = () => {
    navigate('/home');
  };

  // Item management functions
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.nombre.trim()) {
      alert('El nombre del artículo no puede estar vacío');
      return;
    }

    try {
      setCreatingItem(true);
      
      const articleData = {
        nombre: newItem.nombre.trim(),
        contenido: newItem.contenido.trim() || '',
        listas: [parseInt(listId)] // Assign to current list
      };

      await articuloService.crear(articleData);
      
      // Reload list data to show new item
      await cargarDatosLista(user.id);
      
      // Clear form and close modal
      setNewItem({ nombre: '', contenido: '' });
      setShowAddModal(false);
      
    } catch (error) {
      console.error('Error creando artículo:', error);
      alert('Error al crear el artículo. Por favor, intenta de nuevo.');
    } finally {
      setCreatingItem(false);
    }
  };

  const handleEditItem = (itemId) => {
    const item = articulos.find(a => a.id === itemId);
    setEditedItems(prev => ({
      ...prev,
      [itemId]: {
        nombre: item.nombre,
        contenido: item.contenido
      }
    }));
    setEditingItems(prev => new Set(prev).add(itemId));
  };

  const handleSaveItem = async (itemId) => {
    const editedData = editedItems[itemId];
    if (!editedData.nombre.trim()) {
      alert('El nombre del artículo no puede estar vacío');
      return;
    }

    try {
      const originalItem = articulos.find(a => a.id === itemId);
      const updatedItem = {
        ...originalItem,
        nombre: editedData.nombre.trim(),
        contenido: editedData.contenido.trim() || ''
      };

      await articuloService.actualizar(itemId, updatedItem);
      
      // Reload data to show changes
      await cargarDatosLista(user.id);
      
      // Clear editing state
      setEditingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      setEditedItems(prev => {
        const newItems = { ...prev };
        delete newItems[itemId];
        return newItems;
      });
      
    } catch (error) {
      console.error('Error actualizando artículo:', error);
      alert('Error al actualizar el artículo. Por favor, intenta de nuevo.');
    }
  };

  const handleCancelEditItem = (itemId) => {
    setEditingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    setEditedItems(prev => {
      const newItems = { ...prev };
      delete newItems[itemId];
      return newItems;
    });
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${itemName}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeletingItems(prev => new Set(prev).add(itemId));
      
      await articuloService.eliminar(itemId);
      
      // Reload data to reflect changes
      await cargarDatosLista(user.id);
      
    } catch (error) {
      console.error('Error eliminando artículo:', error);
      alert('Error al eliminar el artículo. Por favor, intenta de nuevo.');
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="listview-container">
        <div className="loading">Cargando lista...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="listview-container">
        <div className="error-message">{error}</div>
        <button onClick={handleGoBack} className="back-btn">
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="listview-container">
      <header className="listview-header">
        <div className="header-content">
          <button onClick={handleGoBack} className="back-btn">
            ← Volver
          </button>
          <div className="user-info">
            <span>Usuario: {user?.nombre}</span>
          </div>
        </div>
      </header>

      <main className="listview-main">
        <div className="list-header-section">
          {isEditingList ? (
            <div className="edit-list-form">
              <input
                type="text"
                value={editedListName}
                onChange={(e) => setEditedListName(e.target.value)}
                className="edit-list-input"
                maxLength={100}
                disabled={savingList}
                autoFocus
              />
              <div className="edit-actions">
                <button 
                  onClick={handleSaveListName}
                  className="save-btn"
                  disabled={savingList || !editedListName.trim()}
                >
                  {savingList ? 'Guardando...' : 'Guardar'}
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="cancel-btn"
                  disabled={savingList}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="list-title-section">
              <h1>{lista?.nombre}</h1>
              <button 
                onClick={() => setIsEditingList(true)}
                className="edit-title-btn"
                title="Editar nombre de la lista"
              >
                ✏️
              </button>
            </div>
          )}
          
          <div className="list-meta">
            <span className="creation-date">
              Creada el: {lista?.fechacreacion}
            </span>
            <span className="items-count">
              {articulos.length} artículo{articulos.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <section className="items-section">
          <div className="items-header">
            <h2>Artículos en esta lista</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="add-item-btn"
            >
              + Nuevo Artículo
            </button>
          </div>
          
          {articulos.length === 0 ? (
            <div className="no-items">
              <p>Esta lista no tiene artículos aún.</p>
              <p>¡Agrega algunos artículos para empezar a organizarte!</p>
            </div>
          ) : (
            <div className="items-list">
              {articulos.map((articulo) => (
                <div key={articulo.id} className="item-card">
                  {editingItems.has(articulo.id) ? (
                    // Edit mode
                    <div className="edit-item-form">
                      <div className="form-group">
                        <label>Nombre:</label>
                        <input
                          type="text"
                          value={editedItems[articulo.id]?.nombre || ''}
                          onChange={(e) => setEditedItems(prev => ({
                            ...prev,
                            [articulo.id]: {
                              ...prev[articulo.id],
                              nombre: e.target.value
                            }
                          }))}
                          className="edit-item-input"
                          maxLength={200}
                        />
                      </div>
                      <div className="form-group">
                        <label>Contenido:</label>
                        <textarea
                          value={editedItems[articulo.id]?.contenido || ''}
                          onChange={(e) => setEditedItems(prev => ({
                            ...prev,
                            [articulo.id]: {
                              ...prev[articulo.id],
                              contenido: e.target.value
                            }
                          }))}
                          className="edit-item-textarea"
                          maxLength={200}
                          rows={3}
                        />
                      </div>
                      <div className="edit-item-actions">
                        <button 
                          onClick={() => handleSaveItem(articulo.id)}
                          className="save-item-btn"
                        >
                          Guardar
                        </button>
                        <button 
                          onClick={() => handleCancelEditItem(articulo.id)}
                          className="cancel-item-btn"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="item-header">
                        <div className="item-title">
                          <h3>{articulo.nombre}</h3>
                        </div>
                        <div className="item-actions">
                          <button 
                            onClick={() => handleEditItem(articulo.id)}
                            className="edit-item-btn"
                            title="Editar artículo"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(articulo.id, articulo.nombre)}
                            className="delete-item-btn"
                            disabled={deletingItems.has(articulo.id)}
                            title="Eliminar artículo"
                          >
                            {deletingItems.has(articulo.id) ? '...' : '🗑️'}
                          </button>
                        </div>
                      </div>
                      <div className="item-content">
                        <p>{articulo.contenido}</p>
                      </div>
                      <div className="item-meta">
                        <span className="item-lists">
                          Aparece en {articulo.listas.length} lista{articulo.listas.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal para agregar nuevo artículo */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Agregar Nuevo Artículo</h3>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setNewItem({ nombre: '', contenido: '' });
                }}
                className="modal-close-btn"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddItem} className="modal-form">
              <div className="form-group">
                <label htmlFor="itemName">Nombre del artículo:</label>
                <input
                  type="text"
                  id="itemName"
                  value={newItem.nombre}
                  onChange={(e) => setNewItem(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Leche, Pan, Llamar al doctor..."
                  required
                  maxLength={200}
                  disabled={creatingItem}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="itemContent">Descripción (opcional):</label>
                <textarea
                  id="itemContent"
                  value={newItem.contenido}
                  onChange={(e) => setNewItem(prev => ({ ...prev, contenido: e.target.value }))}
                  placeholder="Ej: 1 litro de leche entera, Pan integral..."
                  maxLength={200}
                  rows={3}
                  disabled={creatingItem}
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    setNewItem({ nombre: '', contenido: '' });
                  }}
                  className="btn-cancel"
                  disabled={creatingItem}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-create"
                  disabled={creatingItem || !newItem.nombre.trim()}
                >
                  {creatingItem ? 'Creando...' : 'Agregar Artículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListView;
