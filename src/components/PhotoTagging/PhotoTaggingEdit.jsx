import {
  updatePhotoTagging,
  geTournamentList,
  getMatchList,
  currentPhotoTagging,
  getPlayerProfileList,
  getTeamList,
  getCustomTagsList,
} from '@/_services/services_api';
import { faArrowLeft, faImage, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import CustomTagsAdd from '../CustomTags/CustomTagsAdd';

const ReusableDropdown = dynamic(import('../ReusableDropdown'));

function PhotoTaggingEdit({ id }) {
  const photoTaggingId = id;
  const [formValues, setFormValues] = useState({
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState({});
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState('');
  const [editionData, setEditionData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [matchData, setMatchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPhotoData, setCurrentPhotoData] = useState(null);
  const [tagsData, setTagsData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [show, setShow] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
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
      const folderName = setFile === setThumbnailFile ? 'photo_tagging' : '';
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
      console.error(`Error uploading ${setFile === setThumbnailFile ? 'photo_tagging' : ''} file:`, error);
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
    if (photoTaggingId) {
      handleTournamentList();
      handlePlayerList();
      handleTeamList();
      handleMatchList();
      handleCurrentPhotoTag();
      handleTagsList();
    }
  }, [photoTaggingId]);

  const handleTagsList = async (e) => {
    setLoading(true);
    const res = await getCustomTagsList();
    if (res?.status) {
      const data = res.data;
      setTagsData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (photoTaggingId) {
      const values = {
        status: currentPhotoData?.status || '',
      };
      setFormValues(values);
      setThumbnailFile(currentPhotoData?.imageUrl);
      setSelectedTags(currentPhotoData?.customTags);
      setSelectedPlayer(currentPhotoData?.players);
      setSelectedTeam(currentPhotoData?.teams);
    }
  }, [photoTaggingId, currentPhotoData]);

  const handleCurrentPhotoTag = async () => {
    const res = await currentPhotoTagging(photoTaggingId);
    if (res?.status) {
      const data = res.data;
      setCurrentPhotoData(data);
    }
  };

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
    const errors = formValidation();
    setFormErrors(errors);
    setLoading(true);

    if (Object.keys(errors).length === 0) {
      const params = {
        imageUrl: thumbnailFile,
        edition: (selectedEdition == '' && currentPhotoData?.edition) || [selectedEdition.name],
        matches: (selectedMatch == '' && currentPhotoData?.matches) || [selectedMatch.matchnumber],
        players: selectedPlayer.map((i) => i),
        teams: selectedTeam.map((i) => i),
        customTags: selectedTags.map((i) => i),
        status: formValues.status,
      };

      const res = await updatePhotoTagging(photoTaggingId, params);

      if (res?.status) {
        toast.success(res.message);
        router.push('/photo-tagging');
      } else {
        toast.error(res?.message);
      }
    }
    setLoading(false);
  };

  const formValidation = () => {
    const errors = {};

    if (!thumbnailFile) {
      errors.thumbnailFile = 'Please upload photo';
    }

    if (currentPhotoData.edition.length == 0) {
      errors.selectedEdition = 'Please select edition';
    }
    if (selectedPlayer.length == 0) {
      errors.selectedPlayer = 'Please select player';
    }
    if (selectedTeam.length == 0) {
      errors.selectedTeam = 'Please select team';
    }
    if (currentPhotoData.matches.length == 0) {
      errors.selectedMatch = 'Please select match';
    }

    return errors;
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleCheckboxChange = (tagName) => {
    const isTagSelected = selectedTags.includes(tagName);

    if (isTagSelected) {
      const updatedTags = selectedTags.filter((tag) => tag !== tagName);
      setSelectedTags(updatedTags);
    } else {
      setSelectedTags((prevTags) => [...prevTags, tagName]);
    }
  };

  const handleCheckboxPlayer = (tagName) => {
    const isTagSelected = selectedPlayer.includes(tagName);

    if (isTagSelected) {
      const updatedTags = selectedPlayer.filter((tag) => tag !== tagName);
      setSelectedPlayer(updatedTags);
    } else {
      setSelectedPlayer((prevTags) => [...prevTags, tagName]);
    }
  };

  const handleCheckboxTeam = (tagName) => {
    const isTagSelected = selectedTeam.includes(tagName);

    if (isTagSelected) {
      const updatedTags = selectedTeam.filter((tag) => tag !== tagName);
      setSelectedTeam(updatedTags);
    } else {
      setSelectedTeam((prevTags) => [...prevTags, tagName]);
    }
  };

  const filterOptions = (data, searchValue, key) => {
    return data.filter((option) => {
      const value = option[key];
      return value && value.toLowerCase().includes(searchValue.toLowerCase());
    });
  };

  const filteredOptionsTeam = filterOptions(teamData, searchValue, 'teamName');
  const filteredOptionsPlayer = filterOptions(playerData, searchValue, 'name');
  const filteredOptions = filterOptions(tagsData, searchValue, 'tag');

  return (
    <>
      {show && (
        <CustomTagsAdd
          {...{
            show,
            handleTagsList,
            handleClose: () => setShow(false),
          }}
        />
      )}
      <Container fluid>
        <Row>
          <Col>
            <Link href={'/photo-tagging'} className="slate_gray">
              <FontAwesomeIcon icon={faArrowLeft} width={15} height={15} className="me-2" />
              Back
            </Link>
            <Card className="bg-white mt-3">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0">Edit Photo Tagging</h4>
                </div>
                <Form autoComplete="off" className="mt-3" onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Upload Photo</Form.Label>
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
                                  className="common_btn text-white rounded-2 py-2 px-3 fs_14 me-2 cursor_pointer"
                                  htmlFor="thumbnail"
                                >
                                  <span className="d-inline-flex align-middle">Upload Photo</span>
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
                        <Form.Group className="position-relative">
                          <Form.Label className="blue_dark fw-medium">Select Edition</Form.Label>
                          {(editionData && (
                            <ReusableDropdown
                              options={editionData}
                              selectedValue={
                                (selectedEdition == '' && currentPhotoData?.edition.toString()) ||
                                selectedEdition?.name ||
                                'Select Edition'
                              }
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
                              selectedValue={
                                (selectedMatch == '' && currentPhotoData?.matches.toString()) ||
                                selectedMatch?.matchnumber ||
                                'Select Match'
                              }
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
                      <Form.Group className="mb-3">
                        <Form.Label className="blue_dark fw-medium">Select Player</Form.Label>
                        <Dropdown className="w-100 rounded-1">
                          <Dropdown.Toggle
                            variant="none"
                            className="fs_14 slate_gray w-100 d-flex justify-content-between align-items-center form-control shadow-none border"
                            id="dropdown-basic"
                          >
                            <span className="text-truncate pe-3">
                              {selectedPlayer?.length > 0
                                ? selectedPlayer.map((tag) => tag).join(', ')
                                : 'Select Player'}
                            </span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="w-100 overflow-auto dropdown_height">
                            <div className="px-2 mb-2">
                              <div className="w-100">
                                <input
                                  type="search"
                                  placeholder="Search Player"
                                  onChange={handleSearchChange}
                                  className="form-control shadow-none fs_14 slate_gray"
                                  value={searchValue}
                                />
                              </div>
                            </div>
                            {filteredOptionsPlayer.map((option) => (
                              <div
                                key={option.playerId}
                                className="d-flex align-items-center user-select-none dropdown-item w-100 slate_gray"
                              >
                                <input
                                  type="checkbox"
                                  id={option.playerId}
                                  className="cursor_pointer"
                                  onChange={() => handleCheckboxPlayer(option.name)}
                                  checked={selectedPlayer?.some((tag) =>
                                    typeof tag === 'object' ? tag.playerId === option.playerId : tag === option.name
                                  )}
                                />
                                <label htmlFor={option.playerId} className="ms-3 cursor_pointer user-select-none w-100">
                                  {option.name}
                                </label>
                              </div>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                      {formErrors.selectedPlayer && (
                        <p className="text-danger fs_14 error-message">{formErrors.selectedPlayer}</p>
                      )}
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="blue_dark fw-medium">Select Team</Form.Label>
                        <Dropdown className="w-100 rounded-1">
                          <Dropdown.Toggle
                            variant="none"
                            className="fs_14 slate_gray w-100 d-flex justify-content-between align-items-center form-control shadow-none border"
                            id="dropdown-basic"
                          >
                            <span className="text-truncate pe-3">
                              {selectedTeam?.length > 0 ? selectedTeam.map((tag) => tag).join(', ') : 'Select Team'}
                            </span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="w-100 overflow-auto dropdown_height">
                            <div className="px-2 mb-2">
                              <div className="w-100">
                                <input
                                  type="search"
                                  placeholder="Search Team"
                                  onChange={handleSearchChange}
                                  className="form-control shadow-none fs_14 slate_gray"
                                  value={searchValue}
                                />
                              </div>
                            </div>
                            {filteredOptionsTeam.map((option) => (
                              <div
                                key={option.teamId}
                                className="d-flex align-items-center user-select-none dropdown-item w-100 slate_gray"
                              >
                                <input
                                  type="checkbox"
                                  id={option.teamId}
                                  className="cursor_pointer"
                                  onChange={() => handleCheckboxTeam(option.teamName)}
                                  checked={selectedTeam?.some((tag) =>
                                    typeof tag === 'object' ? tag.id === option.teamId : tag === option.teamName
                                  )}
                                />
                                <label htmlFor={option.teamId} className="ms-3 cursor_pointer user-select-none w-100">
                                  {option.teamName}
                                </label>
                              </div>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                      {formErrors.selectedTeam && (
                        <p className="text-danger fs_14 error-message">{formErrors.selectedTeam}</p>
                      )}
                    </Col>

                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label className="blue_dark fw-medium">Select Tags</Form.Label>
                        <Dropdown className="w-100 rounded-1">
                          <Dropdown.Toggle
                            variant="none"
                            className="fs_14 slate_gray w-100 d-flex justify-content-between align-items-center form-control shadow-none border"
                            id="dropdown-basic"
                          >
                            <span className="text-truncate pe-3">
                              {selectedTags?.length > 0 ? selectedTags.map((tag) => tag).join(', ') : 'Select Tags'}
                            </span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="w-100 overflow-auto dropdown_height">
                            <div className="px-2 mb-2 d-flex gap-2 align-items-center">
                              <div className="w-100">
                                <input
                                  type="search"
                                  placeholder="Search Tags"
                                  onChange={handleSearchChange}
                                  className="form-control shadow-none fs_14 slate_gray"
                                  value={searchValue}
                                />
                              </div>
                              <div
                                className="common_btn text-white h-100 p-1 px-2 rounded-2 cursor_pointer text-nowrap"
                                onClick={() => setShow(true)}
                              >
                                <FontAwesomeIcon icon={faPlusCircle} width={16} height={16} />
                              </div>
                            </div>
                            {filteredOptions.map((option) => (
                              <div
                                key={option.id}
                                className="d-flex align-items-center user-select-none dropdown-item w-100 slate_gray"
                              >
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  onChange={() => handleCheckboxChange(option.tag)}
                                  className="cursor_pointer"
                                  checked={selectedTags?.some((tag) =>
                                    typeof tag === 'object' ? tag.id === option.id : tag === option.tag
                                  )}
                                />

                                <label htmlFor={option.id} className="ms-3 cursor_pointer user-select-none w-100">
                                  {option.tag}
                                </label>
                              </div>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
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
                    <Col lg={12}>
                      <Button
                        variant=""
                        className="px-4 text-white common_btn shadow-none"
                        disabled={loading}
                        type="submit"
                      >
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

export default PhotoTaggingEdit;
