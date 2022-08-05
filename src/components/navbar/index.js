import React from 'react';
import { Button, Navbar, Container, Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { logout } from '../../utils/auth';

export default function NavbarApp() {
  const history = useHistory();

  return (
    <Navbar bg='light' variant='light'>
      <Container>
        <Navbar.Brand href='/home'>Spotify App</Navbar.Brand>
        <Nav className='me-auto'>
          <Nav.Link href='/home'>Menú</Nav.Link>
          <Nav.Link href='/lista'>Favoritas</Nav.Link>
        </Nav>
        <Navbar.Text className='me-1'>
          {localStorage?.getItem('name') ?? 'Error'}
        </Navbar.Text>
        <Button
          variant='danger'
          onClick={() => {
            history.push('/');
            logout();
          }}
        >
          Cerrar Sesión
        </Button>
      </Container>
    </Navbar>
  );
}
