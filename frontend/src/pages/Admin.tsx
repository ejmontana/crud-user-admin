import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Product, User } from '../types';
import { Plus, Edit, Trash, UserCog, Package2, Check, X } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment';
import LoadingSpinner from '../components/Loading';
import * as XLSX from 'xlsx';
const MySwal = withReactContent(Swal);

interface DecodedToken {
  exp: number;
  iat: number;
  userWithoutPassword: {
    Email: string;
    EstadoID: number;
    FechaCreacion: string;
    FechaModificacion: string | null;
    NombreCompleto: string;
    RoleID: number;
    Telefono: number;
    UserID: number;
    Usuario: string;
    UsuarioCreaID: number;
    UsuarioModificaID: number | null;
  };
}
const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export function Admin() {
  const [view, setView] = useState<'products' | 'users'>('users');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [productsList, setProductsList] = useState<Product[]>([]); // Para refrescar la lista de productos
  const [errorField, setErrorField] = useState('');


  let user: DecodedToken | null = null;

  if (token) {
    try {
      user = jwtDecode<DecodedToken>(token);

    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
    }
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);


    if (user) {
      if (!editingProduct) {
        formData.append('UsuarioCreaID', user.userWithoutPassword.UserID.toString())
      } else {
        formData.append('UsuarioModificaID', user.userWithoutPassword.UserID.toString());
      }
    }


    const url = editingProduct
      ? `http://localhost:3030/api/productos/${editingProduct.ProductoID}`
      : 'http://localhost:3030/api/productos';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          // No se agrega Content-Type ya que FormData establece sus propios boundaries
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        MySwal.fire({
          title: 'Error',
          text: errorData.message || (editingProduct ? 'Error actualizando producto' : 'Error creando producto'),
          icon: 'error',
          confirmButtonText: 'Cerrar',
          customClass: {
            confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
            popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
          }
        });
        return;
      }
      //const result = await response.json();
      MySwal.fire({
        title: editingProduct ? 'Actualizado' : 'Creado',
        text: editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
        icon: 'success',
        confirmButtonText: 'Cerrar',
        customClass: {
          confirmButton: 'bg-green-600 text-white rounded-md hover:bg-green-700',
          popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
        }
      });
      setShowProductForm(false);
      setEditingProduct(null);

      fetchProducts();
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);

      MySwal.fire({
        title: 'Error',
        text: editingProduct ? 'Error actualizando producto' : 'Error creando producto',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        customClass: {
          confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
          popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
        }
      });
    }
    fetchProducts();
    setLoading(false);
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorField('');
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      Usuario: formData.get('Usuario') as string,
      NombreCompleto: formData.get('NombreCompleto') as string,
      Telefono: formData.get('Telefono') as string,
      Email: formData.get('Email') as string,
      PasswordHash: formData.get('Password') as string,
      RoleID: formData.get('RoleID') as string,
      EstadoID: Number(formData.get('EstadoID')) || 1,
      UsuarioCreaID: user.userWithoutPassword.UserID,
      FechaModificacion: editingUser ? new Date().toISOString() : null,
      UsuarioModificaID: editingUser ? user.userWithoutPassword.UserID : null
    };

    const url = editingUser
      ? `http://localhost:3030/api/users/${editingUser.UserID}`
      : 'http://localhost:3030/api/users/register';
    const method = editingUser ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message?.includes('El Email esta en uso')) setErrorField('Email');
        if (errorData.message?.includes('El Usuario esta en uso')) setErrorField('Usuario');
        MySwal.fire({
          title: 'Validaciones',
          text: errorData.message || editingUser ? 'Error Actualizando el usuario' : 'Error Creando el usuario',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          customClass: {
            confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
            popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
          }
        });
        return;
      }
      const result = await response.json();
      console.log('User created/updated:', result);
      setShowUserForm(false);
      setEditingUser(null);
      MySwal.fire({
        title: 'Validaciones',
        text: editingUser ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
        icon: 'success',
        confirmButtonText: 'Cerrar',
        customClass: {
          confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
          popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
        }
      });
      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      MySwal.fire({
        title: 'Error',
        text: editingUser ? 'Error Actualizando el usuario' : 'Error Creando el usuario',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        customClass: {
          confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
          popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3030/api/users/alluser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Usuario no autorizado');
      }
      const data = await response.json();
      setAllUser(data);
    } catch (error) {
      console.error('Error:', error);
      MySwal.fire({
        title: 'Error',
        text: 'Usuario no autorizado',
        icon: 'error',
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
          popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (idUser: number) => {
    const result = await MySwal.fire({
      title: '¿Está seguro?',
      text: 'No podrá revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
        cancelButton: 'bg-gray-600 text-white rounded-md hover:bg-gray-700',
        popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
      }
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3030/api/users/${idUser}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Error al eliminar el usuario');
        }
        MySwal.fire({
          title: 'Eliminado',
          text: 'El usuario ha sido eliminado.',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
            popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
          }
        });

        fetchUsers();
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        MySwal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar el usuario.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          customClass: {
            confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
            popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
          }
        });
      } finally {
        setLoading(false);
      }
    }
  }

  const deleteProduct = async (idProduct: number) => {
    const result = await MySwal.fire({
      title: '¿Está seguro?',
      text: 'No podrá revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
        cancelButton: 'bg-gray-600 text-white rounded-md hover:bg-gray-700',
        popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
      }
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3030/api/productos/${idProduct}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Error al eliminar el usuario');
        }
        MySwal.fire({
          title: 'Eliminado',
          text: 'El usuario ha sido eliminado.',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
            popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
          }
        });

        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        MySwal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar el usuario.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          customClass: {
            confirmButton: 'bg-red-600 text-white rounded-md hover:bg-red-700',
            popup: 'bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors dark:text-white'
          }
        });
      } finally {
        setLoading(false);
      }
    }
  }

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3030/api/productos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      setProductsList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);
  return (
    <Layout>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
        {loading && <LoadingSpinner />}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Panel de Administración
            </h2>

            <div className="mt-4 space-x-4">
              <button
                onClick={() => { setShowProductForm(false); setView('users') }}
                className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${view === 'users'
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
              >
                <UserCog className="w-4 h-4 mr-2" />
                Usuarios
              </button>
              <button
                onClick={() => { setShowUserForm(false); setView('products') }}
                className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${view === 'products'
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
              >
                <Package2 className="w-4 h-4 mr-2" />
                Productos
              </button>
            </div>
          </div>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => {
                if (view === 'products') {
                  exportToExcel(productsList, 'Productos');
                } else {
                  exportToExcel(allUser, 'Usuarios');
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
            >
              Exportar {view === 'products' ? 'Productos' : 'Usuarios'}
            </button>
            <button
              onClick={() => {
                if (view === 'products') {
                  setEditingProduct(null);
                  setShowProductForm(true);
                } else {
                  setEditingUser(null);
                  setShowUserForm(true);
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo {view === 'products' ? 'Producto' : 'Usuario'}
            </button>
          </div>
        </div>

        {showProductForm && view === 'products' && (
          <form onSubmit={handleSubmitProduct} className="mb-6 p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700" encType="multipart/form-data">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre
                </label>
                <input
                  type="text"
                  name="Nombre"
                  defaultValue={editingProduct?.Nombre}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descripción
                </label>
                <textarea
                  name="Descripcion"
                  defaultValue={editingProduct?.Descripcion}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="Precio"
                  defaultValue={editingProduct?.Precio}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stock
                </label>
                <input
                  type="number"
                  name="Stock"
                  defaultValue={editingProduct?.Stock}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Imagen
                </label>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  className="mt-1 block w-full text-gray-700 dark:text-gray-300"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowProductForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
              >
                Guardar
              </button>
            </div>
          </form>
        )}

        {showUserForm && (
          <form onSubmit={handleSubmitUser} className="mb-6 p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usuario
                </label>
                <input
                  type="text"
                  name="Usuario"
                  defaultValue={editingUser?.Usuario || ''}
                  maxLength={50}
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white ${errorField === 'Usuario' ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="NombreCompleto"
                  defaultValue={editingUser?.NombreCompleto || ''}
                  maxLength={300}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teléfono
                </label>
                <input
                  type="number"
                  name="Telefono"
                  defaultValue={editingUser?.Telefono || ''}
                  maxLength={15}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="Email"
                  defaultValue={editingUser?.Email || ''}
                  maxLength={50}
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white ${errorField === 'Email' ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="Password"

                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rol
                </label>
                <select
                  name="RoleID"
                  defaultValue={editingUser?.RoleID || '1'}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                >
                  <option value="1">Administrador</option>
                  <option value="2">Usuario</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estado
                </label>
                <select
                  name="EstadoID"
                  defaultValue={editingUser?.EstadoID || '1'}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                >
                  <option value="1">Activo</option>
                  <option value="2">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowUserForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
              >
                Guardar
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          {view === 'products' ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {productsList.map((product) => (
                  <tr key={product.ProductoID}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.ImagenURL}
                            alt="Producto"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.Nombre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        ${product.Precio.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {product.Stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        onClick={() => deleteProduct(product.ProductoID)}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Telefono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fecha de Creación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Creado Por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {allUser.map((user) => (
                  <tr key={user.UserID}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.Usuario}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.Email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.NombreCompleto}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.Telefono}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.NombreRol === "Administrador"
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                        {user.NombreRol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.EstadoDescripcion === "Activo"
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {user.EstadoDescripcion === "Activo" ? (
                          <Check className="w-4 h-4 mr-1" />
                        ) : (
                          <X className="w-4 h-4 mr-1" />
                        )}
                        {user.EstadoDescripcion}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {moment(user.FechaCreacion).format('DD/MM/YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.CreadoPor}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowUserForm(true);
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        onClick={() => deleteUser(user.UserID)}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>


    </Layout>
  );
}