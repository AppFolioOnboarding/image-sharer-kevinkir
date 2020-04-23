import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import Footer from './Footer';
import FeedbackForm from './FeedbackForm';
import Header from './Header';

const App = () => (
  <Container>
    <Row className="mt-5">
      <Col>
        <Header title="Tell us what you think" />
        <FeedbackForm />
        <Footer />
      </Col>
    </Row>
  </Container>
);

export default App;
