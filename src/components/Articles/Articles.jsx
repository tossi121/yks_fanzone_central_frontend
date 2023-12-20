import { deleteArticles, getArticlesList } from '@/_services/services_api';
import { faEdit, faImage, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import parse from 'html-react-parser';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';

const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));
const DeleteModal = dynamic(import('../DeleteModal'));
const TableLoader = dynamic(import('../DataTable/TableLoader'));

function Articles() {
  const [articlesData, setArticlesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { page } = router.query;

  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page));
      router.replace('/articles');
    }
  }, [page]);

  const columns = [
    { heading: 'Id', field: 'serialNumber' },
    { heading: 'Image', field: 'imageUrl' },
    { heading: 'Title', field: 'title' },
    { heading: 'Articles Type', field: 'articles_type' },
    { heading: 'Tags', field: 'tags' },
    { heading: 'Content', field: 'content' },
    { heading: 'Schedule', field: 'schedule' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];

  useEffect(() => {
    handleArticlesList();
  }, [currentPage]);

  const options = {
    columns: {
      render: {
        action: renderActions,
        schedule: renderDate,
        imageUrl: renderThumbnailImage,
        articles_type: renderArticle,
        content: renderContent,
        status: renderSatus,
      },
    },
  };

  function renderSatus(value, row) {
    const statusColors = {
      Published: 'success',
      Unpublished: 'danger',
    };

    return (
      <>
        <Badge pill bg={statusColors[row.status]} className="fs_12">
          {row.status}
        </Badge>
      </>
    );
  }

  function renderThumbnailImage(value, row) {
    return (
      <>
        {(row.imageUrl && (
          <Image src={process.env.IMAGE_BASE + row.imageUrl} width={50} height={50} alt="thumbnailImage" />
        )) || <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={25} height={25} />}
      </>
    );
  }

  function renderContent(value, row) {
    const trimmedContent = row.content.length > 450 ? `${row.content.slice(0, 450)}...` : row.content;
    return <>{parse(trimmedContent)}</>;
  }

  function renderDate(value, row) {
    return <span className="text-nowrap">{moment(row.schedule).format('DD MMMM YYYY')} </span>;
  }

  function renderArticle(value, row) {
    return <span>{row.articles_type?.join(', ')} </span>;
  }

  const handleArticlesList = async () => {
    setLoading(true);
    const res = await getArticlesList();
    if (res.status) {
      const data = res.data;
      setArticlesData(data);
    }
    setLoading(false);
  };

  function renderActions(value, row) {
    const handleDeleteModal = () => {
      setDeleteId(row);
      setShowModal(true);
    };

    return (
      <>
        <div className="action_btn text-nowrap">
          <Link href={`articles/${row.id}?page=${currentPage}`}>
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

  const handleDelete = async (e) => {
    const params = {
      id: deleteId.id,
    };
    setLoading(true);
    setCurrentPage(1);
    const res = await deleteArticles(params);
    if (res?.status) {
      toast.success(res?.message);
      setShowModal(false);
      handleArticlesList();
    } else {
      toast.error(res?.message);
    }
    setLoading(false);
  };

  function ModalGallery() {
    return (
      <>
        <Modal show={show} centered size="lg" onHide={() => setShow(false)}>
          <Modal.Header closeButton className="fw-semibold">
            Full Content
          </Modal.Header>
          <Modal.Body>
            <div className=""></div>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  return (
    <>
      {show && <ModalGallery />}

      {showModal && (
        <DeleteModal
          {...{
            showModal,
            setShowModal,
            loading,
            closeModal: () => setShowModal(false),
            handleDelete,
            text: 'article',
          }}
        />
      )}
      <Container fluid>
        <Row>
          <Col>
            <Card className="bg-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h4 className="fw-bold mb-0">Articles</h4>
                  <Link className="common_btn text-white px-3 py-1 rounded-2" href="/articles/add">
                    <FontAwesomeIcon icon={faPlusCircle} width={16} height={16} className="me-1" /> Add
                  </Link>
                </div>
                {(!loading && articlesData && (
                  <CustomDataTable
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    rows={articlesData}
                    columns={columns}
                    options={options}
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

export default Articles;
