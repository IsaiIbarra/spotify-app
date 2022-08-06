import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Col, Row, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { logout } from '../../utils/auth';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import axios from 'axios';
import './styles.css';

export default function Home() {
  const history = useHistory();
  const [favorites, setFavorites] = useState([]);

  //Para guardar los resultado de la busqueda
  const [results, setResults] = useState([]);

  //Función para llamar a la API de gestionar favoritos (agregar y eliminar)
  const manageFavorites = async (name, image, note, id) => {
    try {
      //Para obtener el indice del id dentro del array
      let index = favorites.indexOf(id);

      //Para visualizar que se agregue y se elimine de favoritos
      if (index === -1) setFavorites((favorites) => [...favorites, id]);
      else setFavorites((favorites) => [favorites.splice(index, 1)]);

      const { data } = await axios.post(
        'http://localhost:5000/manageFavorites',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: {
            name_fav: name,
            img_fav: image,
            note_fav: note,
            id_spotify_fav: id,
            id_use: localStorage?.getItem('id') ?? null,
          },
        }
      );

      console.log(data);
    } catch (error) {
      console.warn(error);
    }
  };

  //Función para llamar a la API de busqueda spotify
  const search = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          q: e.target.busqueda.value,
          type: 'track',
        },
      });
      setResults(data.tracks.items);

      console.log(data);
    } catch (error) {
      let errorStatus = error.response?.status;

      if (errorStatus === 401) {
        history.push('/');
        logout();
      }
    }
  };

  //Función para armar la vista de los resultados de busqueda
  const renderResults = () => {
    return results.map((item) => {
      return (
        <Col key={item.id} sm={4} className='mb-3'>
          <Card>
            {item.album.images.length ? (
              <Card.Img variant='top' src={item.album.images[0].url} alt='' />
            ) : (
              <div>No image</div>
            )}
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Button
                variant='light'
                onClick={() => {
                  manageFavorites(
                    item.name,
                    item.album.images[0].url,
                    'Para al rato',
                    item.id
                  );
                }}
              >
                {favorites.indexOf(item.id) > -1 ? <HeartFill /> : <Heart />}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      );
    });
  };

  //Función para llamar a la API y obtener la lista de favoritos del usuario
  const getFavorites = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/getFavoritesSongs',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setFavorites(data.ids_spotify_fav);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    getFavorites();
    if (!localStorage.getItem('token')) {
      history.push('/');
    }
  }, []);

  return (
    <Container>
      <Row className='justify-content-center'>
        <Col sm={10}>
          <Card className='card-home mt-3'>
            <Card.Body>
              <Row className='justify-content-center mt-2'>
                <Col sm={7}>
                  {/* Formulario de busqueda */}
                  <Form onSubmit={search}>
                    <Row>
                      <Col sm={11} className='mb-2'>
                        <Form.Control
                          type='text'
                          name='busqueda'
                          placeholder='¿Qué quieres escuchar hoy?'
                          required
                        />
                      </Col>
                      <Col sm={1} className='mb-2'>
                        <Button variant='success' type='submit'>
                          Buscar
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>

              {/* Para desplegar los resultados de busqueda */}
              {results.length > 0 && (
                <>
                  <hr className='mx-5' />
                  <Row className='vertical-scrollable'>{renderResults()}</Row>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
