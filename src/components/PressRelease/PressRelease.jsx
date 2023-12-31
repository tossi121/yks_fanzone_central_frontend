import React, { useEffect, useState } from 'react';
import { deletePressRelease, getPressReleasesList } from '@/_services/services_api';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import { faEdit, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));
const DeleteModal = dynamic(import('../DeleteModal'));
const TableLoader = dynamic(import('../DataTable/TableLoader'));

function PressRelease() {
  const [pressReleases, setPressReleases] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { page } = router.query;

  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page));
      router.replace('/press-release');
    }
  }, [page]);

  const columns = [
    { heading: 'Id', field: 'serialNumber' },
    { heading: 'Title', field: 'title' },
    { heading: 'Update By', field: 'update_by' },
    { heading: 'Updated Date', field: 'updatedAt' },
    { heading: 'Publish Date', field: 'publishDate' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];

  const options = {
    columns: {
      render: {
        updatedAt: renderDate,
        publishDate: renderPublishDate,
        status: renderSatus,
        action: renderActions,
      },
    },
  };

  function renderActions(value, row) {
    const handleDeleteModal = () => {
      setDeleteId(row);
      setShowModal(true);
    };
    return (
      <>
        <div className="action_btn text-nowrap">
          <Link href={`press-release/${row.id}?page=${currentPage}`}>
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

  function renderDate(value, row) {
    return <span className="text-nowrap">{moment(row.updatedAt).format('DD MMMM YYYY')} </span>;
  }

  function renderPublishDate(value, row) {
    return <span className="text-nowrap">{moment(row.publishDate).format('DD MMMM YYYY')} </span>;
  }

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

  useEffect(() => {
    handlePressReleasesList();
  }, [currentPage]);

  const handlePressReleasesList = async (e) => {
    setLoading(true);
    const res = await getPressReleasesList();
    if (res?.status) {
      const data = res.data;
      setPressReleases(data);
    }
    setLoading(false);
  };

  const handleDelete = async (e) => {
    const params = {
      id: deleteId.id,
    };
    setLoading(true);
    const res = await deletePressRelease(params);
    setCurrentPage(1);
    if (res?.status) {
      toast.success(res?.message);
      setShowModal(false);
      handlePressReleasesList();
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
            text: 'press release',
          }}
        />
      )}
      <Container fluid>
        <Row>
          <Col>
            <Card className="bg-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h4 className="fw-bold mb-0">Press Releases</h4>
                  <Link className="common_btn text-white px-3 py-1 rounded-2" href="/press-release/add">
                    <FontAwesomeIcon icon={faPlusCircle} width={16} height={16} className="me-1" /> Add
                  </Link>
                </div>

                {(!loading && pressReleases && (
                  <CustomDataTable
                    rows={pressReleases}
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

export default PressRelease;
