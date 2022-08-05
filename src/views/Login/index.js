import React, { useEffect, useState } from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import logo from '../../assets/images/system/logo.png';
import axios from 'axios';
import './styles.css';

export default function Login() {
  const [token, setToken] = useState('');
  const history = useHistory();

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
      localStorage.setItem('name', name);
      history.push('/home');
    } catch (error) {
      console.warn(error);
    }
  };

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

  useEffect(() => {
    const hash = window.location.hash;
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
    setToken(token);

    if (token) {
      dataUser();
    }
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
            <Button variant='success'>Iniciar Sesión</Button>
          </a>
        </Card.Body>
      </Card>
    </div>
  );
}
