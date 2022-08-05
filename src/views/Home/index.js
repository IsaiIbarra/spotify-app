import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Col, Row, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { logout } from '../../utils/auth';
import { Heart } from 'react-bootstrap-icons';
import axios from 'axios';
import './styles.css';

export default function Home() {
  const history = useHistory();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      history.push('/');
    }
  }, []);

  return (
    <Container>
      <Row className='justify-content-center'>
        <Col sm={8}>
          <Card className='card-home mt-3'>
            <Card.Body>Hola mundo</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
