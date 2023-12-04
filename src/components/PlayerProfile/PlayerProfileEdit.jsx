import { currentPlayerProfile, updatePlayerProfile } from '@/_services/services_api';
import { faArrowLeft, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

import dynamic from 'next/dynamic';

const ImageLoader = dynamic(import('../DataTable/ImageLoader'));

function PlayerProfileEdit({ id }) {
  const playerProfileId = id;
  const [formValues, setFormValues] = useState({
    playerName: '',
    nickName: '',
    height: '',
    country: '',
    skills: '',
    bio: '',
    category: '',
  });
  const [yearsActiveStart, setYearsActiveStart] = useState(null);
  const [yearsActiveEnd, setYearsActiveEnd] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [dob, setDob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
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
        height: currentPlayer?.height || '',
        country: currentPlayer?.home_town || '',
        skills: currentPlayer?.skill || '',
        bio: currentPlayer?.bio || '',
        category: currentPlayer?.category || '',
      };

      setFormValues(values);
      const playerPosition = currentPlayer?.position_name;
      setSelectedItems(playerPosition);
      setThumbnailFile(thumbnailFile != null && currentPlayer?.profile_url);
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
        profile_url: thumbnailFile,
        name: formValues.playerName,
        short_name: formValues.nickName,
        category: formValues.category,
        position_name: selectedItems,
        date_of_birth: moment(dob).format('YYYY-MM-DD'),
        country_name: formValues.country,
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

  const createFormData = (file, folderName) => {
    const formData = new FormData();
    formData.append('folderName', folderName);
    formData.append('files', file);
    return formData;
  };

  const getHeaders = () => {
    return {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${Cookies.get('yks_fanzone_central_token')}`,
    };
  };

  const handleUpload = async (file, setFile) => {
    try {
      const folderName = setFile === setThumbnailFile ? 'yks/player_profile' : '';
      const formData = createFormData(file, folderName);
      const headers = getHeaders();

      const response = await axios.post(
        `${process.env.BASE_API_URL}${process.env.PRESS_RELEASES_UPLOAD_FILE_DATA}`,
        formData,
        { headers }
      );

      if (response?.data?.status) {
        setTimeout(() => {
          setFile(response?.data?.result[0]);
          setThumbnailLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error(`Error uploading ${setFile === setThumbnailFile ? 'thumbnail' : 'pdf'} file:`, error);
    }
  };

  const handleFileClick = (event, setFile) => {
    const file = event.target.files[0];
    handleSize(file, (error) => {
      if (!error) {
        handleUpload(file, setFile);
      }
    });
  };

  const handleSize = (file, callback) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setThumbnailError('Profile picture size should be 10 MB or less');
      callback('Profile picture size should be 10 MB or less');
    } else {
      setThumbnailError(null);
      callback(null);
      setThumbnailLoading(true);
    }
  };

  const handleThumbnailClick = (event) => {
    handleFileClick(event, setThumbnailFile);
  };

  const formValidation = (values) => {
    const errors = {};

    if (!values.playerName) {
      errors.playerName = 'Please enter name';
    }

    if (!values.nickName) {
      errors.nickName = 'Please enter nick name';
    }

    if (!values.height) {
      errors.height = 'Please enter height';
    }

    if (!values.country) {
      errors.country = 'Please enter country';
    }
    if (!values.bio) {
      errors.bio = 'Please enter bio';
    }
    if (!thumbnailFile) {
      errors.thumbnailFile = 'Please profile picture';
    } else if (thumbnailFile.size > 10 * 1024 * 1024) {
      errors.thumbnailFile = 'File size should be 10 MB or less';
    }

    if (!values.skills) {
      errors.skills = 'Please enter a skills';
    }

    if (selectedItems == null || selectedItems.length === 0) {
      errors.position = 'Please select a position';
    }

    if (!values.category) {
      errors.category = 'Please select a category';
    }

    if (!dob) {
      errors.dob = 'Please select a date of birth';
    }

    if (!yearsActiveStart) {
      errors.yearsActiveStart = 'Please select a years active start';
    }

    if (!yearsActiveEnd) {
      errors.yearsActiveEnd = 'Please select a years active end';
    }

    return errors;
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setYearsActiveStart(start);
    setYearsActiveEnd(end);
  };

  const dropdownMenu = [
    {
      Raider: ['Right Raider', 'Left Raider'],
      Defender: ['Left Corner', 'Left Cover', 'Right Cover', 'Right Corner'],
    },
  ];

  const handleCheckboxChange = (option) => {
    setSelectedItems((prevSelected) => {
      const isSelected = Array.isArray(prevSelected) && prevSelected.includes(option);

      if (isSelected) {
        return prevSelected.filter((item) => item !== option);
      } else {
        return [...(Array.isArray(prevSelected) ? prevSelected : []), option];
      }
    });
  };

  const selectedOptions =
    formValues.category === 'All_Rounder'
      ? dropdownMenu.flatMap((item) => Object.values(item).flat())
      : (dropdownMenu.find((item) => item[formValues.category]) || {})[formValues.category] || [];

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
                  <Row className="align-items-baseline">
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Player Profile</Form.Label>
                      <div className="mb-3">
                        <div className="file_upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {(thumbnailLoading && <ImageLoader />) || (
                            <>
                              {(thumbnailFile && (
                                <>
                                  <Link
                                    target="_blank"
                                    className="cursor_pointer"
                                    href={process.env.IMAGE_BASE + thumbnailFile}
                                  >
                                    <Image
                                      src={process.env.IMAGE_BASE + thumbnailFile}
                                      alt="thumbnail"
                                      height={150}
                                      width={150}
                                      className="rounded-3 mb-2"
                                    />
                                  </Link>
                                </>
                              )) || (
                                <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={35} height={35} />
                              )}
                              <div>
                                <Form.Control
                                  type="file"
                                  id="thumbnail"
                                  onChange={handleThumbnailClick}
                                  accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                                  className="d-none"
                                  aria-describedby="thumbnail"
                                />
                                <label
                                  className="common_btn text-white rounded-2 py-2 px-3 fs-14 me-2 cursor_pointer"
                                  htmlFor="thumbnail"
                                >
                                  <span className="d-inline-flex align-middle">Player Profile </span>
                                </label>
                              </div>
                            </>
                          )}
                        </div>
                        {(thumbnailError && <p className="text-danger fs_13 mt-1">{thumbnailError}</p>) || (
                          <p className="text-danger fs_13 mt-1">{formErrors.thumbnailFile}</p>
                        )}
                      </div>
                    </Col>

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
                          <Form.Label className="blue_dark fw-medium">Select Position Category </Form.Label>
                          <Form.Select
                            name="category"
                            value={formValues.category}
                            onChange={handleChange}
                            className="shadow-none fs_14 slate_gray form-control cursor_pointer"
                          >
                            <option>Select Position Category</option>
                            <option value={'Raider'}>Raider</option>
                            <option value={'Defender'}>Defender</option>
                            <option value={'All_Rounder'}>All Rounder</option>
                          </Form.Select>
                          {formErrors.category && <p className="text-danger fs_13 mt-1">{formErrors.category}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Select Position </Form.Label>
                          <Dropdown className="w-100 rounded-1">
                            <Dropdown.Toggle
                              variant=""
                              className="fs_14 slate_gray w-100 d-flex justify-content-between align-items-center form-control shadow-none border"
                              id="dropdown-basic"
                              disabled={selectedOptions == null || selectedOptions.length == 0}
                            >
                              {selectedItems == null || selectedItems.length === 0
                                ? 'Select Position'
                                : selectedItems.join(', ')}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100">
                              {selectedOptions.map((option, index) => (
                                <div key={index} className="d-flex align-items-center dropdown-item w-100">
                                  <input
                                    type="checkbox"
                                    id={index}
                                    checked={selectedItems?.includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                    className="cursor_pointer"
                                  />
                                  <label htmlFor={index} className="ms-3 cursor_pointer user-select-none w-100">
                                    {option}
                                  </label>
                                </div>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
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
                          dateFormat="dd MMM yyyy"
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
                          {formErrors.height && <p className="text-danger fs_13 mt-1">{formErrors.height}</p>}
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
                          {formErrors.skills && <p className="text-danger fs_13 mt-1">{formErrors.skills}</p>}
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
                          {formErrors.bio && <p className="text-danger fs_13 mt-1">{formErrors.bio}</p>}
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
