import {
  addVideoTaggings,
  geTournamentList,
  getMatchList,
  getPlayerProfileList,
  getTeamList,
} from '@/_services/services_api';
import { faArrowLeft, faImage, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

const ReusableDropdown = dynamic(import('../ReusableDropdown'));

function VideoTaggingAdd() {
  const [formValues, setFormValues] = useState({
    url: '',
    title: '',
    otherTags: [],
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState({});
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState('');
  const [editionData, setEditionData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [playerData, setPlayerData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamData, setTeamData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [matchData, setMatchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState(null);
  const [categories, setCategories] = useState(['']);
  const router = useRouter();

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
      const folderName = setFile === setThumbnailFile ? 'video_tagging' : '';
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
      console.error(`Error uploading ${setFile === setThumbnailFile ? 'video_tagging' : ''} file:`, error);
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
    const maxSize = 500 * 1024;

    if (file && file.size > maxSize) {
      const errorMessage = 'Photo size should be below 500 KB';
      setThumbnailError(errorMessage);
      callback(errorMessage);
    } else {
      setThumbnailError(null);
      callback(null);
      setThumbnailLoading(true);
    }
  };

  const handleThumbnailClick = (event) => {
    handleFileClick(event, setThumbnailFile);
  };

  useEffect(() => {
    handleTournamentList();
    handlePlayerList();
    handleTeamList();
    handleMatchList();
  }, []);

  const handleTournamentList = async () => {
    const res = await geTournamentList();
    if (res.status) {
      const data = res.data;
      setEditionData(data);
    }
  };

  const handlePlayerList = async () => {
    const res = await getPlayerProfileList();
    if (res.status) {
      const data = res.data;
      setPlayerData(data);
    }
  };

  const handleTeamList = async () => {
    const res = await getTeamList();
    if (res.status) {
      const data = res.data;
      setTeamData(data);
    }
  };

  const handleMatchList = async () => {
    const res = await getMatchList();
    if (res.status) {
      const data = res.data;
      setMatchData(data);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidation(formValues);
    setFormErrors(errors);
    setLoading(true);
    if (Object.keys(errors).length === 0) {
      const params = {
        videoUrl: formValues.url,
        title: formValues.title,
        thumbnailsUrl: thumbnailFile,
        edition: [selectedEdition.name],
        matches: [selectedMatch.matchnumber],
        players: selectedPlayer.map((i) => i.name),
        teams: selectedTeam.map((i) => i.teamName),
        customTags: (formValues.otherTags.length == 0 && []) || [formValues.otherTags],
        status: formValues.status,
        categories: categories,
      };

      const res = await addVideoTaggings(params);

      if (res?.status) {
        toast.success(res.message);
        router.push('/video-tagging');
      } else {
        toast.error(res?.message);
      }
    }
    setLoading(false);
  };
  const formValidation = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = 'Please enter title';
    }
    if (!values.url) {
      errors.url = 'Please enter url';
    }
    if (!categories || categories.some((category) => category.trim() === '')) {
      errors.categories = 'Please enter category';
    }

    if (!thumbnailFile) {
      errors.thumbnailFile = 'Please upload thumbnail';
    }

    if (!selectedEdition) {
      errors.selectedEdition = 'Please select edition';
    }
    if (selectedPlayer.length == 0) {
      errors.selectedPlayer = 'Please select player';
    }
    if (selectedTeam.length == 0) {
      errors.selectedTeam = 'Please select team';
    }
    if (!selectedMatch) {
      errors.selectedMatch = 'Please select match';
    }

    return errors;
  };

  useEffect(() => {
    const getVideoDetails = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: {
            part: 'snippet',
            id: getVideoIdFromUrl(formValues.url),
            key: process.env.YOUTUBE_API_KEY,
          },
        });

        setVideoDetails(response.data.items[0].snippet);
      } catch (error) {
        console.error('Error fetching YouTube video details:', error);
      }
    };

    getVideoDetails();
  }, [formValues.url]);

  const getVideoIdFromUrl = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
  };

  useEffect(() => {
    if (videoDetails) {
      const values = {
        title: videoDetails?.title,
        url: formValues.url,
        status: 'Active',
        otherTags: formValues.otherTags,
      };
      setFormValues(values);
      const thumbnailUrl = videoDetails?.thumbnails?.standard?.url;
      setThumbnailFile(thumbnailUrl);
    }
  }, [videoDetails]);

  const handleAddCategory = () => {
    setCategories([...categories, '']);
  };

  const handleDeleteCategory = (index) => {
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Link href={'/video-tagging'} className="slate_gray">
              <FontAwesomeIcon icon={faArrowLeft} width={15} height={15} className="me-2" />
              Back
            </Link>
            <Card className="bg-white mt-3">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0">Add Video Tagging</h4>
                </div>
                <Form autoComplete="off" className="mt-3" onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter URL</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter URL"
                            name="url"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.url}
                            onChange={handleChange}
                          />
                          {formErrors.url && <p className="text-danger fs_13 mt-1">{formErrors.url}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Tilte</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Tilte"
                            name="title"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.title}
                            onChange={handleChange}
                          />
                          {formErrors.title && <p className="text-danger fs_13 mt-1">{formErrors.title}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Upload Thumbnail</Form.Label>
                      <div className="mb-3">
                        <div className="file_upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {(thumbnailLoading && (
                            <Spinner animation="border" size="lg" variant="primary" className="spinner" />
                          )) || (
                            <>
                              {(thumbnailFile && (
                                <>
                                  <Link
                                    target="_blank"
                                    className="cursor_pointer"
                                    href={
                                      (thumbnailFile.includes('video_tagging') &&
                                        process.env.IMAGE_BASE + thumbnailFile) ||
                                      thumbnailFile
                                    }
                                  >
                                    <Image
                                      src={
                                        (thumbnailFile.includes('video_tagging') &&
                                          process.env.IMAGE_BASE + thumbnailFile) ||
                                        thumbnailFile
                                      }
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
                                  className="common_btn text-white rounded-2 py-2 px-3 fs_14 me-2 cursor_pointer"
                                  htmlFor="thumbnail"
                                >
                                  <span className="d-inline-flex align-middle">Upload Thumbnail</span>
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
                      <Form.Label className="blue_dark fw-medium">Status</Form.Label>
                      <div className="mb-3">
                        <Form.Check
                          inline
                          className="fs_14 slate_gray"
                          label="Active"
                          type="radio"
                          id="Active"
                          value="Active"
                          checked={formValues.status === 'Active'}
                          onChange={handleChange}
                          name="status"
                        />
                        <Form.Check
                          inline
                          className="fs_14 slate_gray"
                          label="Inactive"
                          type="radio"
                          id="Inactive"
                          value="Inactive"
                          checked={formValues.status === 'Inactive'}
                          onChange={handleChange}
                          name="status"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="blue_dark fw-medium">Select Edition</Form.Label>
                          {(editionData && (
                            <ReusableDropdown
                              options={editionData}
                              selectedValue={selectedEdition ? selectedEdition.name : 'Select Edition'}
                              onSelect={setSelectedEdition}
                              placeholder="Edition"
                              displayKey="name"
                              singleSelect={true}
                            />
                          )) ||
                            ''}
                          {formErrors.selectedEdition && (
                            <p className="text-danger fs_14 error-message">{formErrors.selectedEdition}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="blue_dark fw-medium">Select Match</Form.Label>
                          {(matchData && (
                            <ReusableDropdown
                              options={matchData}
                              selectedValue={selectedMatch ? selectedMatch.matchnumber : 'Select Match'}
                              onSelect={setSelectedMatch}
                              placeholder="Match"
                              displayKey="matchnumber"
                              singleSelect={true}
                            />
                          )) ||
                            ''}
                          {formErrors.selectedMatch && (
                            <p className="text-danger fs_14 error-message">{formErrors.selectedMatch}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="blue_dark fw-medium">Select Player</Form.Label>
                          {(playerData && (
                            <ReusableDropdown
                              options={playerData}
                              selectedValue={
                                selectedPlayer.length > 0 && Array.isArray(selectedPlayer)
                                  ? selectedPlayer.map((i) => i.name).join(',')
                                  : 'Select Player'
                              }
                              onSelect={setSelectedPlayer}
                              placeholder="Player"
                              displayKey="name"
                            />
                          )) ||
                            ''}
                          {formErrors.selectedPlayer && (
                            <p className="text-danger fs_14 error-message">{formErrors.selectedPlayer}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="blue_dark fw-medium">Select Team</Form.Label>
                          {(teamData && (
                            <ReusableDropdown
                              options={teamData}
                              selectedValue={
                                selectedTeam.length > 0 && Array.isArray(selectedTeam)
                                  ? selectedTeam.map((i) => i.teamName).join(',')
                                  : 'Select Team'
                              }
                              onSelect={setSelectedTeam}
                              placeholder="Team"
                              displayKey="teamName"
                            />
                          )) ||
                            ''}
                          {formErrors.selectedTeam && (
                            <p className="text-danger fs_14 error-message">{formErrors.selectedTeam}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Enter Categories</Form.Label>
                      {categories.map((category, index) => (
                        <>
                          <Form.Group className="d-flex align-items-center gap-3 mb-3 w-100" key={index}>
                            <Form.Control
                              type="text"
                              placeholder="Enter Category"
                              value={category}
                              onChange={(e) => {
                                const updatedCategories = [...categories];
                                updatedCategories[index] = e.target.value;
                                setCategories(updatedCategories);
                              }}
                              className="shadow-none fs_14 slate_gray"
                            />

                            {(index > 0 && (
                              <Button
                                variant="danger"
                                className="p-0 category_btn shadow-none"
                                onClick={() => handleDeleteCategory(index)}
                              >
                                <FontAwesomeIcon icon={faTrash} width={15} height={15} />
                              </Button>
                            )) || (
                              <Button
                                variant=""
                                className="p-0 text-white common_btn category_btn shadow-none"
                                onClick={handleAddCategory}
                              >
                                <FontAwesomeIcon icon={faPlus} width={15} height={15} />
                              </Button>
                            )}
                          </Form.Group>
                        </>
                      ))}
                      {formErrors.categories && <p className="text-danger fs_13">{formErrors.categories}</p>}
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Other Tags</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="otherTags"
                            value={formValues.otherTags}
                            onChange={handleChange}
                            className="shadow-none fs_14 slate_gray textarea_description"
                            placeholder="Enter other tags"
                          />
                          {formErrors.otherTags && <p className="text-danger fs_13 mt-1">{formErrors.otherTags}</p>}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={12}>
                      <Button variant="" className="px-4 text-white common_btn shadow-none" disabled={loading} type="submit">
                        Save
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

export default VideoTaggingAdd;
