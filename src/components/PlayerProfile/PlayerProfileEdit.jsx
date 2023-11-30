import { currentPlayerProfile, updatePlayerProfile } from '@/_services/services_api';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

function PlayerProfileEdit({ id }) {
  const playerProfileId = id;
  const [formValues, setFormValues] = useState({
    playerName: '',
    nickName: '',
    position: '',
    height: '',
    country: '',
    skills: '',
    bio: '',
  });
  const [yearsActiveStart, setYearsActiveStart] = useState(null);
  const [yearsActiveEnd, setYearsActiveEnd] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [dob, setDob] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (playerProfileId) {
      handlePlayerProfile();
    }
  }, [playerProfileId]);

  const handlePlayerProfile = async () => {
    const res = await currentPlayerProfile(playerProfileId);
    if (res?.status) {
      const data = res.data;
      setCurrentPlayer(data?.[0]);
    }
  };

  useEffect(() => {
    if (playerProfileId) {
      const values = {
        playerName: currentPlayer?.name || '',
        nickName: currentPlayer?.nick_name || '',
        position: currentPlayer?.position || '',
        height: currentPlayer?.height || '',
        country: currentPlayer?.home_town || '',
        skills: currentPlayer?.skill || '',
        bio: currentPlayer?.bio || '',
      };
      setFormValues(values);
      const yearsActive = currentPlayer?.years_active;
      if (yearsActive) {
        const [startYear, endYear] = yearsActive.split('-');
        const startDate = new Date(`${startYear}-01-01`);
        const endDate = new Date(`${endYear}-12-31`);
        setYearsActiveStart(startDate);
        setYearsActiveEnd(endDate);
      } else {
        console.error('yearsActive is undefined');
      }

      const dobDate = new Date(currentPlayer?.date_of_birth);
      if (!isNaN(dobDate.getTime())) {
        setDob(dobDate);
      } else {
        console.error('Invalid date format');
      }
    }
  }, [playerProfileId, currentPlayer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidation(formValues);
    setFormErrors(errors);
    setLoading(true);
    if (Object.keys(errors).length === 0) {
      const yearsActive = moment(yearsActiveStart).format('YYYY') + '-' + moment(yearsActiveEnd).format('YYYY');
      const params = {
        name: formValues.name,
        nick_name: formValues.nickName,
        position: formValues.position,
        date_of_birth: moment(dob).format('YYYY-MM-DD'),
        home_town: formValues.country,
        height: formValues.height,
        years_active: yearsActive,
        skill: formValues.skills,
        bio: formValues.bio,
      };

      const res = await updatePlayerProfile(playerProfileId, params);

      if (res?.status) {
        toast.success(res.message);
        router.push('/player-profile');
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

    if (!values.playerName) {
      errors.playerName = 'Please enter a name';
    }

    if (!values.nickName) {
      errors.nickName = 'Please enter a nick name';
    }

    if (!values.country) {
      errors.country = 'Please enter a country';
    }

    if (!values.position) {
      errors.position = 'Please enter a position';
    }

    if (!dob) {
      errors.dob = 'Please select a date of birth';
    }

    return errors;
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setYearsActiveStart(start);
    setYearsActiveEnd(end);
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Link href={'/player-profile'} className="slate_gray">
              <FontAwesomeIcon icon={faArrowLeft} width={15} height={15} className="me-2" />
              Back
            </Link>
            <Card className="bg-white mt-3">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0">Edit Player Profile</h4>
                </div>
                <Form autoComplete="off" className="mt-3" onSubmit={handleSubmit}>
                  <Row className="align-items-center">
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Name"
                            name="playerName"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.playerName}
                            onChange={handleChange}
                          />
                          {formErrors.playerName && <p className="text-danger fs_13 mt-1">{formErrors.playerName}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Nick Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Nick Name"
                            name="nickName"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.nickName}
                            onChange={handleChange}
                          />
                          {formErrors.nickName && <p className="text-danger fs_13 mt-1">{formErrors.nickName}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Position</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Position"
                            name="position"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.position}
                            onChange={handleChange}
                          />
                          {formErrors.position && <p className="text-danger fs_13 mt-1">{formErrors.position}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Select Date of Birth</Form.Label>
                      <div className="mb-3 d-flex flex-column">
                        <ReactDatePicker
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          selected={dob}
                          onChange={(date) => setDob(date)}
                          placeholderText="Select Date of Birth"
                          showTimeSelect={false}
                          dateFormat="dd-MMM-yyyy"
                          className="shadow-none fs_14 slate_gray"
                          onKeyDown={(e) => e.preventDefault()}
                        />
                        {formErrors.dob && <p className="text-danger fs_13 mt-1">{formErrors.dob}</p>}
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Country</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Country"
                            name="country"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.country}
                            onChange={handleChange}
                          />
                          {formErrors.country && <p className="text-danger fs_13 mt-1">{formErrors.country}</p>}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Height</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Height"
                            name="height"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.height}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Select Years Active</Form.Label>
                      <div className="mb-3 d-flex flex-column">
                        <ReactDatePicker
                          placeholderText="Select Years Active"
                          onKeyDown={(e) => e.preventDefault()}
                          className="shadow-none fs_14 slate_gray"
                          selected={yearsActiveStart}
                          onChange={handleDateChange}
                          startDate={yearsActiveStart}
                          endDate={yearsActiveEnd}
                          selectsRange
                          dateFormat="yyyy"
                          showYearPicker
                          maxDate={new Date()}
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Skills</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Skills"
                            name="skills"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.skills}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Bio</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="bio"
                            value={formValues.bio}
                            onChange={handleChange}
                            className="shadow-none fs_14 slate_gray textarea_description"
                            placeholder="Boi of the player"
                          />
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <Button variant="" className="px-4 text-white common_btn" disabled={loading} type="submit">
                        Update
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

export default PlayerProfileEdit;
