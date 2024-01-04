import {
  addPhotoTaggings,
  geTournamentList,
  getCustomTagsList,
  getMatchList,
  getPlayerProfileList,
  getTeamList,
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

function PhotoTaggingAdd() {
  const [formValues, setFormValues] = useState({
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState({});
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState('');
  const [editionData, setEditionData] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [matchData, setMatchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [show, setShow] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [tagsData, setTagsData] = useState([]);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  useEffect(() => {
    handleTagsList();
  }, []);

  const handleTagsList = async (e) => {
    setLoading(true);
    const res = await getCustomTagsList();
    if (res?.status) {
      const data = res.data;
      setTagsData(data);
    }
    setLoading(false);
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
    const errors = formValidation();
    setFormErrors(errors);
    setLoading(true);

    if (Object.keys(errors).length === 0) {
      const params = {
        imageUrl: thumbnailFile,
        edition: [selectedEdition.name],
        matches: [selectedMatch.matchnumber],
        players: selectedPlayer.map((i) => i.name),
        teams: selectedTeam.map((i) => i.name),
        customTags: selectedTags.map((i) => i.name),
        status: formValues.status,
      };

      const res = await addPhotoTaggings(params);

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

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleCheckboxChange = (tagId, tagName) => {
    if (selectedTags.some((tag) => tag.id === tagId)) {
      setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
    } else {
      setSelectedTags([...selectedTags, { id: tagId, name: tagName }]);
    }
  };

  const filteredOptions = tagsData.filter((option) => option.tag.toLowerCase().includes(searchValue.toLowerCase()));

  const handleCheckboxPlayer = (tagId, tagName) => {
    if (selectedPlayer.some((tag) => tag.id === tagId)) {
      setSelectedPlayer(selectedPlayer.filter((tag) => tag.id !== tagId));
    } else {
      setSelectedPlayer([...selectedPlayer, { id: tagId, name: tagName }]);
    }
  };

  const filteredOptionsPlayer = playerData.filter((option) =>
    option.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleCheckboxTeam = (tagId, tagName) => {
    if (selectedTeam.some((tag) => tag.id === tagId)) {
      setSelectedTeam(selectedTeam.filter((tag) => tag.id !== tagId));
    } else {
      setSelectedTeam([...selectedTeam, { id: tagId, name: tagName }]);
    }
  };
  const filteredOptionsTeam = teamData.filter((option) =>
    option.teamName.toLowerCase().includes(searchValue.toLowerCase())
  );

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
                  <h4 className="fw-bold mb-0">Add Photo Tagging</h4>
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
                      <Form.Group className="mb-3">
                        <Form.Label className="blue_dark fw-medium">Select Player</Form.Label>
                        <Dropdown className="w-100 rounded-1">
                          <Dropdown.Toggle
                            variant="none"
                            className="fs_14 slate_gray w-100 d-flex justify-content-between align-items-center form-control shadow-none border"
                            id="dropdown-basic"
                          >
                            <span className="text-truncate pe-3">
                              {selectedPlayer.length > 0
                                ? selectedPlayer.map((tag) => tag.name).join(', ')
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
                                  onChange={() => handleCheckboxPlayer(option.playerId, option.name)}
                                  className="cursor_pointer"
                                  checked={selectedPlayer.some((tag) => tag.id === option.playerId)}
                                />
                                <label htmlFor={option.playerId} className="ms-3 cursor_pointer user-select-none w-100">
                                  {option.name}
                                </label>
                              </div>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      {formErrors.selectedPlayer && (
                        <p className="text-danger fs_14 error-message">{formErrors.selectedPlayer}</p>
                      )}
                      </Form.Group>
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
                              {selectedTeam.length > 0 ? selectedTeam.map((tag) => tag.name).join(', ') : 'Select Team'}
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
                                  onChange={() => handleCheckboxTeam(option.teamId, option.teamName)}
                                  className="cursor_pointer"
                                  checked={selectedTeam.some((tag) => tag.id === option.teamId)}
                                />

                                <label htmlFor={option.teamId} className="ms-3 cursor_pointer user-select-none w-100">
                                  {option.teamName}
                                </label>
                              </div>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      {formErrors.selectedTeam && (
                        <p className="text-danger fs_14 error-message">{formErrors.selectedTeam}</p>
                      )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="blue_dark fw-medium">Select Tags</Form.Label>
                        <Dropdown className="w-100 rounded-1">
                          <Dropdown.Toggle
                            variant="none"
                            className="fs_14 slate_gray w-100 d-flex justify-content-between align-items-center form-control shadow-none border"
                            id="dropdown-basic"
                          >
                            <span className="text-truncate pe-3">
                              {selectedTags.length > 0 ? selectedTags.map((tag) => tag.name).join(', ') : 'Select Tags'}
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
                                  onChange={() => handleCheckboxChange(option.id, option.tag)}
                                  className="cursor_pointer"
                                  checked={selectedTags.some((tag) => tag.id === option.id)}
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

export default PhotoTaggingAdd;
