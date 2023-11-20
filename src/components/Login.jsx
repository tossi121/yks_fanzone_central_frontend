import Image from 'next/image';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';

function Login() {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  return (
    <>
      <section className="login_section min-vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <Row className="justify-content-center">
            <Col xl={9} md={10} xs={12}>
              <Card className="border-0">
                <Card.Body className="p-0">
                  <div className="d-sm-flex justify-content-center align-items-center">
                    <Image
                      src="/images/login.webp"
                      alt="login"
                      className="rounded-start-3 d-none d-lg-block"
                      layout="responsive"
                      objectFit="cover"
                      height={100}
                      width={100}
                    />
                    <div className="p-4 w-100">
                      <div className="text-center mb-3">
                        <h3 className="blue_dark fw-semibold mb-0">Welcome to</h3>
                        <h2 className="blue_dark fw-bold">YKS Fanzone Central</h2>
                      </div>
                      <Form autoComplete="off">
                        <div className="mb-3">
                          <Form.Group>
                            <Form.Label className="blue_dark fw_500">Enter Email Address</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Email Address"
                              name="email"
                              className="shadow-none fs_14 slate_gray py-2 px-2 px-md-3"
                              value={formValues.email.replace(/\s+/g, '')}
                              onChange={handleChange}
                            />
                            {formErrors.email && <p className="text-danger fs_14">{formErrors.email}</p>}
                          </Form.Group>
                        </div>
                        <div className="mb-4">
                          <Form.Group>
                            <Form.Label className="blue_dark fw_500">Enter Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Enter Your Password"
                              name="password"
                              className="shadow-none fs_14 slate_gray py-2 px-2 px-md-3"
                              value={formValues.password.replace(/\s+/g, '')}
                              onChange={handleChange}
                            />
                            {formErrors.password && <p className="text-danger fs_14">{formErrors.password}</p>}
                          </Form.Group>
                        </div>

                        <div className="text-center">
                          <Button
                            variant=""
                            className="w-50 py-2 text-white common_btn"
                            disabled={loading}
                            type="submit"
                          >
                            Login
                            {loading && (
                              <Spinner animation="border" variant="white" size="sm" className="ms-1 spinner" />
                            )}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Login;
