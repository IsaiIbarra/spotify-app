import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Container, Spinner } from 'react-bootstrap';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import axios from 'axios';
import './styles.css';

export default function Favorites() {
  //Para guardar los ids spotify de la lista de favoritas del usuario
  const [favorites, setFavorites] = useState([]);
  //Para validar que esta cargando y mostrar un spinner
  const [cargando, setCargando] = useState(true);
  //Para guardar los datos de las favoritas del usuario
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
      getFavorites();
    } catch (error) {
      console.warn(error);
    }
  };

  //Función para armar la vista de los resultados de busqueda
  const renderResults = () => {
    //Para validar si el usuario no tiene ninguna favorita en su lista
    if (results.length < 1) {
      return (
        <Row className='justify-content-center'>
          <Col>
            <p className='lead'>Actualmente no tienes favoritas :(</p>
          </Col>
        </Row>
      );
    }

    return results.map((item) => {
      return (
        <Col key={item.id_spotify_fav} sm={3} className='mb-3'>
          <Card>
            {item.img_fav ? (
              <Card.Img variant='top' src={item.img_fav} alt='' />
            ) : (
              <div>No image</div>
            )}
            <Card.Body>
              <Card.Title>{item.name_fav}</Card.Title>
              <Card.Text>
                <small>{item.note_fav}</small>
              </Card.Text>
              <Button
                variant='light'
                size='sm'
                onClick={() => {
                  manageFavorites(
                    item.name,
                    item.img_fav,
                    'Para al rato',
                    item.id_spotify_fav
                  );
                }}
              >
                {favorites.indexOf(item.id_spotify_fav) > -1 ? (
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

      setResults(data.favorite_songs);
      setFavorites(data.ids_spotify_fav);
      setCargando(false);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    //Para obtener los favoritos del usuario desde un inicio
    getFavorites();
  }, []);

  return (
    <Container>
      <Row className='justify-content-center'>
        <Col sm={10}>
          <Card className='card-inside mt-3'>
            <Card.Body>
              <h2 className='mt-3'>Tus Favoritas</h2>
              {/* Para desplegar los resultados de busqueda */}
              {results.length > 0 || !cargando ? (
                <>
                  <Row className='vertical-scrollable-favorites mt-5'>
                    {renderResults()}
                  </Row>
                </>
              ) : (
                <Spinner animation='border' role='status' className='mt-3' />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
