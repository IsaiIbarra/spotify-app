//Función para borrar los datos de la sesión
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('name');
}
