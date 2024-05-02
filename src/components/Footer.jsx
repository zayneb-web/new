import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import Iframe from 'react-iframe';
import '../../src/index.css';

const Footer = () => {
  return (
    <div className='footer'>
      <Container>
        <Row className='main-foot'>
          <Col className='col col-lg-4 col-md-12 col-12'>
            <h2 className='text-lg-start text-md-center text-center mb-lg-0 mb-md-5 mb-2 main-title'>Company.</h2>
          </Col>
          <Col className='col col-lg-2 col-md-3 col-12'>
            <ul>
              <li className='list-unstyled'>
                <h5 className='mt-lg-0 mt-md-0 mt-4 mb-3'>About</h5>
              </li>
              <li className='list-unstyled mb-2'>
                <a href="#0">Profile</a>
              </li>
              <li className='list-unstyled mb-2'>
                <a href="#0">Career</a>
              </li>
              <li className='list-unstyled mb-2'>
                <a href="#0">Privacy</a>
              </li>
            </ul>
          </Col>
          <Col className='col col-lg-2 col-md-3 col-12'>
            <ul>
              <li className='list-unstyled'>
                <h5 className='mt-lg-0 mt-md-0 mt-4 mb-3'>Find us</h5>
              </li>
              <li className='list-unstyled mb-2'>
                <a href="#0"><i className="bi bi-instagram"></i> company</a>
              </li>
              <li className='list-unstyled mb-2'>
                <a href="#0"><i className="bi bi-twitter"></i> company_id</a>
              </li>
              <li className='list-unstyled mb-2'>
                <a href="#0"><i className="bi bi-facebook"></i> company</a>
              </li>
            </ul>
          </Col>
          <Col className='col col-lg-3 col-md-6 col-12'>
            <ul>
              <li className='list-unstyled'>
                <h5 className='mt-lg-0 mt-md-0 mt-4 mb-3'>Contact</h5>
              </li>
              <li className='list-unstyled mb-2'>
                <a href="#0"><i className="bi bi-geo-alt-fill"></i> Jl. Letjen abc, Malang, Jawa Timur</a>
              </li>
              <li className='list-unstyled mb-2'>
                <a href="#0"><i className="bi bi-telephone-fill"></i> +9898279387</a>
              </li>
              <li className='list-unstyled mb-2'>
                <a href="#0"><i className="bi bi-envelope-at-fill"></i> company@gmail.com</a>
              </li>
              <li className='list-unstyled'>
                <div className="map mt-4">
                  <Iframe className='rounded-3' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8835255288836!2d107.65409548775703!3d-6.904529470979882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e7930d4629e1%3A0x37d531c82707fa9f!2sJl.%20A.%20Yani%20No.756%2C%20Padasuka%2C%20Kec.%20Kiaracondong%2C%20Kota%20Bandung%2C%20Jawa%20Barat%2040125!5e0!3m2!1sid!2sid!4v1668694705539!5m2!1sid!2sid" 
                  allowFullScreen="" loading="lazy"></Iframe>
                </div>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className='justify-content-lg-between justify-content-md-center justify-content-center mt-5 bott-foot'>
          <Col className='col-lg-4 col-md-12 col-12 text-lg-start text-md-center text-center'>
            <p className='copy'>copyright 2022. All rights reserved</p>
          </Col>
          <Col className='col-lg-4 col-md-12 col-12 text-lg-end text-md-center text-center'>
            <p className='design'>Designed by Okkst00</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;


  

