import React from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Main from "./components/Main/Main";
import Footer from "./components/footer/Footer";


export default function App() {
  return (
          <Container fluid className="mx-0 width-50">

              <Row className="justify-content-center">
                  <Col md={9} className="mx-0">
                  <Main/>
                  </Col>
              </Row>
              <Row className="justify-content-center bg-secondary">
                  <Footer/>
              </Row>

          </Container>


  );
}


