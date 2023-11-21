import { validEmail } from '@/_helper/regex';
import { getLogin } from '@/_services/services_api';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Toaster, toast } from 'react-hot-toast';

function Login() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = formValidation(formValues);
    setFormErrors(errors);
    setLoading(true);
    if (Object.keys(errors).length === 0) {
      const params = {
        email: formValues.email,
        password: formValues.password,
      };
      const res = await getLogin(params);
      if (res.status) {
        const token = res.data.accessToken;
        Cookies.set('yks_fanzone_central_token', token.access_token, { expires: 30, path: '/' });
        router.push('/');
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    }
    setLoading(false);
  };

  const formValidation = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = 'Please enter an email address';
    } else if (!validEmail(values.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!values.password) {
      errors.password = 'Please enter a password';
    } else if (values.password.length < 6) {
      errors.password = 'Password length should be at least 6 characters';
    }

    return errors;
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
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
                      <Form autoComplete="off" onSubmit={handleLogin}>
                        <div className="mb-3">
                          <Form.Group>
                            <Form.Label className="blue_dark fw-medium">Enter Email Address</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Email Address"
                              name="email"
                              className="shadow-none fs_14 slate_gray"
                              value={formValues.email.replace(/\s+/g, '')}
                              onChange={handleChange}
                            />
                            {formErrors.email && <p className="text-danger fs_13 mt-1">{formErrors.email}</p>}
                          </Form.Group>
                        </div>
                        <div className="mb-4">
                          <Form.Group>
                            <Form.Label className="blue_dark fw-medium">Enter Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Enter Your Password"
                              name="password"
                              className="shadow-none fs_14 slate_gray"
                              value={formValues.password.replace(/\s+/g, '')}
                              onChange={handleChange}
                            />
                            {formErrors.password && <p className="text-danger fs_13 mt-1">{formErrors.password}</p>}
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
