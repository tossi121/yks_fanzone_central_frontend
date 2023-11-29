import { validEmail, validName } from '@/_helper/regex';
import { addUserAccessPermissions, getUserAccessPermissions } from '@/_services/services_api';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

function UserAccessAdd() {
  const [formValues, setFormValues] = useState({ firstName: '', lastName: '', email: '', password: '', role: [] });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    handleTournamentList();
  }, []);

  const handleTournamentList = async () => {
    const res = await getUserAccessPermissions();
    if (res?.status) {
      const data = res.data;
      setUserPermissions(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidation(formValues);
    setFormErrors(errors);
    setLoading(true);
    if (Object.keys(errors).length === 0) {
      const params = {
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
        permissions: formValues.role,
        user_role: 'admin',
      };

      const res = await addUserAccessPermissions(params);

      if (res?.status) {
        toast.success(res.message);
        router.push('/user-access');
      } else {
        toast.error(res?.message);
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const formValidation = (values) => {
    const errors = {};

    if (values.role.length === 0) {
      errors.role = 'Please select permissions';
    }

    if (!values.email) {
      errors.email = 'Please enter an email address';
    } else if (!validEmail(values.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!values.firstName) {
      errors.firstName = 'Please enter a first name';
    } else if (!validName(values.firstName)) {
      errors.firstName = 'Please enter a valid first name';
    }

    if (!values.lastName) {
      errors.lastName = 'Please enter a last name';
    } else if (!validName(values.lastName)) {
      errors.lastName = 'Please enter a valid last name';
    }

    if (!values.password) {
      errors.password = 'Please enter a password';
    } else if (values.password.length < 6) {
      errors.password = 'Password length should be at least 6 characters';
    }

    return errors;
  };

  const handleRoleChange = (permission) => {
    setFormValues((prevFormValues) => {
      if (prevFormValues.role.includes(permission)) {
        // If the permission is already in the array, remove it
        return {
          ...prevFormValues,
          role: prevFormValues.role.filter((item) => item !== permission),
        };
      } else {
        // If the permission is not in the array, add it
        return {
          ...prevFormValues,
          role: [...prevFormValues.role, permission],
        };
      }
    });
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Link href={'/user-access'} className="slate_gray">
              <FontAwesomeIcon icon={faArrowLeft} width={15} height={15} className="me-2" />
              Back
            </Link>
            <Card className="bg-white mt-3">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0">Add User Access</h4>
                </div>
                <Form autoComplete="off" className="mt-3" onSubmit={handleSubmit}>
                  <Row className="align-items-center">
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter First Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter First Name"
                            name="firstName"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.firstName}
                            onChange={handleChange}
                          />
                          {formErrors.firstName && <p className="text-danger fs_13 mt-1">{formErrors.firstName}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Last Name"
                            name="lastName"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.lastName}
                            onChange={handleChange}
                          />
                          {formErrors.lastName && <p className="text-danger fs_13 mt-1">{formErrors.lastName}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Email</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Email"
                            name="email"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.email}
                            onChange={handleChange}
                          />
                          {formErrors.email && <p className="text-danger fs_13 mt-1">{formErrors.email}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.password}
                            onChange={handleChange}
                          />
                          {formErrors.password && <p className="text-danger fs_13 mt-1">{formErrors.password}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label className="blue_dark fw-medium">Select Permissions</Form.Label>
                        <Form.Group>
                          {userPermissions.map((item, key) => (
                            <React.Fragment key={key}>
                              <Form.Label
                                className="cursor_pointer slate_gray fs_14 user-select-none me-3"
                                htmlFor={item.permissions}
                              >
                                <input
                                  type="checkbox"
                                  name={item.permissions}
                                  id={item.permissions}
                                  className="form-check-input me-2 shadow-none border"
                                  checked={formValues.role.includes(item.permissions)}
                                  onChange={() => handleRoleChange(item.permissions)}
                                />
                                {item.permissions}
                              </Form.Label>
                            </React.Fragment>
                          ))}
                        </Form.Group>
                        {formErrors.role && <p className="text-danger fs_13 mt-1">{formErrors.role}</p>}
                      </div>
                    </Col>
                    <Col lg={12}>
                      <Button variant="" className="px-4 text-white common_btn" disabled={loading} type="submit">
                        Create
                        {loading && <Spinner animation="border" variant="white" size="sm" className="ms-1 spinner" />}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserAccessAdd;
