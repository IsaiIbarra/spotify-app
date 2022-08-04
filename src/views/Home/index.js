import React from 'react';
import { Button, Card, Image } from 'react-bootstrap';

import logo from '../../assets/images/system/logo.png';
import './styles.css';

export default function Home() {
  return (
    <div className='container-login'>
      <Card className='card-login'>
        <Card.Body>
          <Image className='mb-1 logo' src={logo} />
          <h3>Bienvenido</h3>
          <Card.Text className='mb-5'>
            Para continuar es necesario iniciar sesión con una cuenta de
            Spotify.
          </Card.Text>
          <Button variant='success'>Iniciar Sesión</Button>
        </Card.Body>
      </Card>
    </div>
  );
}
