import React, { useEffect, useState } from 'react';
import { deleteGallery, deletePressRelease, getGalleryList } from '@/_services/services_api';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import { faEdit, faImage, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';

const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));
const DeleteModal = dynamic(import('../DeleteModal'));
const TableLoader = dynamic(import('../DataTable/TableLoader'));

function Gallery() {
  const [gallery, setGallery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const columns = [
    { heading: 'Id', field: 'serialNumber' },
    { heading: 'Thumbnail Image', field: 'thumbnailImage' },
    { heading: 'Title', field: 'name_of_group' },
    { heading: 'Description', field: 'description_of_gallery' },
    { heading: 'Publish Date', field: 'publishDate' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];

  const options = {
    columns: {
      render: {
        thumbnailImage: renderThumbnailImage,
        publishDate: renderPublishDate,
        status: renderSatus,
        action: renderActions,
      },
    },
  };

  function renderThumbnailImage(value, row) {
    return (
      <>
        {(row.thumbnailImage && (
          <Image src={process.env.IMAGE_BASE + row.thumbnailImage} width={50} height={50} alt="thumbnailImage" />
        )) || <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={25} height={25} />}
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
          <Link href={`gallery/${row.id}`}>
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

  function renderPublishDate(value, row) {
    return (
      <>
        {(row.publishDate && <span className="text-nowrap">{moment(row.publishDate).format('DD MMMM YYYY')} </span>) ||
          'N/A'}
      </>
    );
  }

  function renderSatus(value, row) {
    const statusColors = {
      Published: 'success',
      Unpublished: 'danger',
      Draft: 'warning',
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
    handleGalleryList();
  }, []);

  const handleGalleryList = async (e) => {
    setLoading(true);
    const res = await getGalleryList();
    if (res.status) {
      const data = res.data;
      setGallery(data);
    }
    setLoading(false);
  };

  const handleDelete = async (e) => {
    const params = {
      id: deleteId.id,
    };
    setLoading(true);
    const res = await deleteGallery(params);
    if (res?.status) {
      toast.success(res?.message);
      setShowModal(false);
      handleGalleryList();
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
            text: 'gallery',
          }}
        />
      )}
      <Container fluid>
        <Row>
          <Col>
            <Card className="bg-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h4 className="fw-bold mb-0">Gallery</h4>
                  <Link className="common_btn text-white px-3 py-1 rounded-2" href="/gallery/add">
                    <FontAwesomeIcon icon={faPlusCircle} width={16} height={16} className="me-1" /> Add
                  </Link>
                </div>
                {(!loading && gallery && <CustomDataTable rows={gallery} columns={columns} options={options} />) || (
                  <TableLoader />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Gallery;
