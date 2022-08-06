import React, { useEffect } from 'react';
import { Button, Navbar, Container, Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { logout } from '../../utils/logout';
import axios from 'axios';

export default function NavbarApp() {
  const history = useHistory();

  //Función para cerrar la sesión
  const logoutSession = () => {
    history.push('/');
    logout();
  };

  //Función para validar que exista un token
  const validateToken = async () => {
    if (!localStorage.getItem('token')) {
      history.push('/');
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <Navbar bg='light' variant='light'>
      <Container>
        <Navbar.Brand href='/home'>Spotify App</Navbar.Brand>
        <Nav className='me-auto'>
          <Nav.Link href='/home'>Menú</Nav.Link>
          <Nav.Link href='/favorites'>Favoritas</Nav.Link>
        </Nav>
        <Navbar.Text className='me-1'>
          {localStorage?.getItem('name') ?? 'Error'}
        </Navbar.Text>
        <Button variant='danger' onClick={logoutSession}>
          Cerrar Sesión
        </Button>
      </Container>
    </Navbar>
  );
}
