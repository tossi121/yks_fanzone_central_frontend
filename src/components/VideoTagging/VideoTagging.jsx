import React, { useEffect, useState } from 'react';
import { deleteVideoTaggings, getVideoTaggingsList } from '@/_services/services_api';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import { faEdit, faImage, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/router';

const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));
const DeleteModal = dynamic(import('../DeleteModal'));
const TableLoader = dynamic(import('../DataTable/TableLoader'));

function VideoTagging() {
  const [photoTaggingData, setPhotoTaggingData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const { page } = router.query;

  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page));
      router.replace('/video-tagging');
    }
  }, [page]);

  const columns = [
    { heading: 'Id', field: 'serialNumber' },
    { heading: 'Thumbnail', field: 'thumbnailsUrl' },
    { heading: 'Edition', field: 'edition' },
    // { heading: 'Players', field: 'players' },
    // { heading: 'Teams', field: 'teams' },
    { heading: 'Matches', field: 'matches' },
    // { heading: 'Categories', field: 'categories' },
    // { heading: 'Other Tags', field: 'customTags' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];

  const options = {
    columns: {
      render: {
        thumbnailsUrl: renderThumbnailImage,
        edition: renderEdition,
        players: renderPlayers,
        teams: renderTeams,
        matches: renderMatches,
        status: renderSatus,
        action: renderActions,
      },
    },
  };

  function renderEdition(value, row) {
    return <span>{row.edition?.join(', ')} </span>;
  }
  function renderPlayers(value, row) {
    return <span>{row.players?.join(', ')} </span>;
  }
  function renderTeams(value, row) {
    return <span>{row.teams?.join(', ')} </span>;
  }
  function renderMatches(value, row) {
    return <span>{row.matches?.join(', ')} </span>;
  }
  function renderTags(value, row) {
    return <>{(row.customTags?.length > 0 && <span>{row.customTags?.join(', ')} </span>) || 'N/A'}</>;
  }

  function renderThumbnailImage(value, row) {
    return (
      <>
        <Image
          src={
            (row.thumbnailsUrl.includes('video_tagging') && process.env.IMAGE_BASE + row.thumbnailsUrl) ||
            row.thumbnailsUrl
          }
          alt="thumbnail"
          height={50}
          width={50}
          className="rounded-3 mb-2"
        />
      </>
    );
  }

  function renderActions(value, row) {
    const handleDeleteModal = () => {
      setDeleteId(row);
      setShowModal(true);
    };
    return (
      <>
        <div className="action_btn text-nowrap">
          <Link href={`video-tagging/${row.id}?page=${currentPage}`}>
            <FontAwesomeIcon
              title="Edit"
              icon={faEdit}
              width={15}
              height={15}
              className="cursor_pointer blue_dark me-3"
            />
          </Link>
          <FontAwesomeIcon
            title="Delete"
            onClick={handleDeleteModal}
            icon={faTrash}
            width={15}
            height={15}
            className="cursor_pointer blue_dark"
          />
        </div>
      </>
    );
  }

  function renderSatus(value, row) {
    const statusColors = {
      Active: 'success',
      Inactive: 'danger',
    };

    return (
      <>
        <Badge pill bg={statusColors[row.status]} className="fs_12">
          {row.status}
        </Badge>
      </>
    );
  }

  useEffect(() => {
    handlePhotoList();
  }, [currentPage]);

  const handlePhotoList = async (e) => {
    setLoading(true);
    const res = await getVideoTaggingsList();
    if (res.status) {
      const data = res.data;
      setPhotoTaggingData(data);
    }
    setLoading(false);
  };

  const handleDelete = async (e) => {
    const params = {
      id: deleteId.id,
    };
    setLoading(true);
    setCurrentPage(1);
    const res = await deleteVideoTaggings(params);
    if (res?.status) {
      toast.success(res?.message);
      setShowModal(false);
      handlePhotoList();
    } else {
      toast.error(res?.message);
    }
    setLoading(false);
  };

  return (
    <>
      {showModal && (
        <DeleteModal
          {...{
            showModal,
            setShowModal,
            loading,
            closeModal: () => setShowModal(false),
            handleDelete,
            text: 'video tagging',
          }}
        />
      )}
      <Container fluid>
        <Row>
          <Col>
            <Card className="bg-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h4 className="fw-bold mb-0">Video Tagging</h4>
                  <Link className="common_btn text-white px-3 py-1 rounded-2" href="/video-tagging/add">
                    <FontAwesomeIcon icon={faPlusCircle} width={16} height={16} className="me-1" /> Add
                  </Link>
                </div>
                {(!loading && photoTaggingData && (
                  <CustomDataTable
                    rows={photoTaggingData}
                    columns={columns}
                    options={options}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )) || <TableLoader />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default VideoTagging;
