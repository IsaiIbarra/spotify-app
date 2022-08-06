import React, { useEffect, useState } from 'react';
import { Button, Card, Image, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import logo from '../../assets/images/system/logo.png';
import axios from 'axios';
import './styles.css';

export default function Login() {
  const history = useHistory();

  //Para validar que esta cargando y mostrar un spinner
  const [cargando, setCargando] = useState(false);

  //Función para llamar al API y se logue en el sistema
  const login = async (name) => {
    try {
      const { data } = await axios.post('http://localhost:5000/login', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
          user: name,
        },
      });
      localStorage.setItem('id', data.user[0].id_use);
      localStorage.setItem('name', name);
      setCargando(false);
      history.push('/home');
    } catch (error) {
      console.warn(error);
    }
  };

  //Función para obtener los datos del usuario desde la API spotify
  const dataUser = async () => {
    try {
      const { data } = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      login(data.display_name);
    } catch (error) {
      console.warn(error);
    }
  };

  //Función para obtener el token o validar si ya existe uno
  const validationToken = () => {
    let hash = window.location.hash;
    let token = localStorage.getItem('token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '';
      localStorage.setItem('token', token);
    }

    if (token) {
      setCargando(true);
      dataUser();
    }
  };

  useEffect(() => {
    validationToken();
  }, []);

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
          <a
            href={`https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SPOTIFY_CALLBACK_HOST}&response_type=token`}
          >
            <Button variant='success' disabled={cargando}>
              {cargando ? (
                <>
                  <Spinner animation='border' role='status' size='sm' />{' '}
                  Cargando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </a>
        </Card.Body>
      </Card>
    </div>
  );
}
