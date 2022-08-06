import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Col,
  Row,
  Container,
  Spinner,
  Modal,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { logout } from '../../utils/logout';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import axios from 'axios';
import './styles.css';

export default function Home() {
  const history = useHistory();
  //Para guardar los ids spotify de la lista de favoritas del usuario
  const [favorites, setFavorites] = useState([]);
  //Para mostrar u ocultar la modal de nota al agregar un favorito
  const [mostrarModalNota, setMostrarModalNota] = useState(false);
  //Para guardar los datos del favorito a guardar despues de agregar la nota
  const [dataFavorite, setDataFavorite] = useState({});
  //Para validar que esta cargando y mostrar un spinner
  const [cargando, setCargando] = useState(false);

  //Para guardar los resultado de la busqueda
  const [results, setResults] = useState([]);

  //Función para llamar a la API de gestionar favoritos (agregar y eliminar)
  const manageFavorites = async (e = null) => {
    try {
      e && e.preventDefault();
      //Para obtener el indice del id dentro del array
      let index = favorites.indexOf(dataFavorite.id);

      //Para visualizar que se agregue y se elimine de favoritos
      if (index === -1)
        setFavorites((favorites) => [...favorites, dataFavorite.id]);
      else setFavorites((favorites) => [favorites.splice(index, 1)]);

      const { data } = await axios.post(
        'http://localhost:5000/manageFavorites',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: {
            name_fav: dataFavorite.name,
            img_fav: dataFavorite.image,
            note_fav: e?.target.note_fav.value,
            id_spotify_fav: dataFavorite.id,
            id_use: localStorage?.getItem('id') ?? null,
          },
        }
      );

      //Cerramos la modal
      setMostrarModalNota(false);
    } catch (error) {
      console.warn(error);
    }
  };

  //Función para validar si esta agregando o removiendo una favorita para abrir o no la modal
  const actionFavorites = (name, image, id) => {
    setDataFavorite({
      name: name,
      image: image,
      id: id,
    });

    //Validamos si el favorita ya existe en la lista, si no existe es nuevo y debe agregar una nota
    //Si ya existe, entonces el usuario busca removerlo de la lista
    if (favorites.indexOf(id) > -1) {
      manageFavorites();
    } else {
      setMostrarModalNota(true);
    }
  };

  //Función para llamar a la API de busqueda spotify
  const search = async (e = null, aleatorio = null) => {
    setCargando(true);
    e && e.preventDefault();
    try {
      const { data } = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          q: e?.target.busqueda.value ?? aleatorio,
          limit: 40,
          type: 'track',
        },
      });
      setResults(data.tracks.items);

      setCargando(false);
    } catch (error) {
      let errorStatus = error.response?.status;

      if (errorStatus === 401) {
        history.push('/');
        logout();
      }
    }
  };

  //Función para generar un caracter aleatorio para que los resultados iniciales sean aleatorios
  function generateRandomLetter() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';

    //Para armar un pequeño string random
    let search =
      alphabet[Math.floor(Math.random() * alphabet.length)] +
      alphabet[Math.floor(Math.random() * alphabet.length)];

    return search;
  }

  //Función para armar la vista de los resultados de busqueda
  const renderResults = () => {
    return results.map((item) => {
      return (
        <Col key={item.id} sm={3} className='mb-3'>
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
                size='sm'
                onClick={() => {
                  actionFavorites(item.name, item.album.images[0].url, item.id);
                }}
              >
                {favorites.indexOf(item.id) > -1 ? (
                  <>
                    <HeartFill /> Quitar
                  </>
                ) : (
                  <>
                    <Heart /> Añadir
                  </>
                )}
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

      //Guardamos los ids de spotify de los favoritos del usuario
      setFavorites(data.ids_spotify_fav);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    //Para obtener los favoritos del usuario desde un inicio
    getFavorites();
    //Para obtener resultados aletarios iniciales
    search(null, generateRandomLetter());
  }, []);

  return (
    <Container>
      <Row className='justify-content-center'>
        <Col sm={10}>
          <Card className='card-inside mt-3'>
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

              {/* Validar la carga de los datos y desplegar los resultados de la busqueda*/}
              {cargando ? (
                <Spinner animation='border' role='status' className='mt-3' />
              ) : (
                results.length > 0 && (
                  <>
                    <hr className='mx-5 mb-4' />
                    <Row className='vertical-scrollable'>{renderResults()}</Row>
                  </>
                )
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para añadir una nota de texto al agregar a favoritos */}
      <Modal
        show={mostrarModalNota}
        onHide={() => {
          setMostrarModalNota(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>¡Añade una breve nota a tu nueva favorita!</Modal.Title>
        </Modal.Header>
        <Form onSubmit={manageFavorites}>
          <Modal.Body>
            <Form.Group className='mb-3'>
              <Form.Label>Nota:</Form.Label>
              <Form.Control
                as='textarea'
                name='note_fav'
                rows={1}
                maxLength={40}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => {
                setMostrarModalNota(false);
              }}
            >
              Cerrar
            </Button>
            <Button type='submit' variant='success'>
              Guardar Favorita
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
