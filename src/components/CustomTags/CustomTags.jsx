import React, { useEffect, useState } from 'react';
import { deleteCustomTags, getCustomTagsList } from '@/_services/services_api';
import { Card, Col, Container, Row } from 'react-bootstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));
const DeleteModal = dynamic(import('../DeleteModal'));
const CustomTagsAdd = dynamic(import('./CustomTagsAdd'));
const TableLoader = dynamic(import('../DataTable/TableLoader'));

function CustomTags() {
  const [tagsData, setTagsData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { page } = router.query;

  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page));
      router.replace('/custom-tags');
    }
  }, [page]);

  const columns = [
    { heading: 'Id', field: 'serialNumber' },
    { heading: 'Tag', field: 'tag' },
    { heading: 'Updated Date', field: 'updatedAt' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];

  const options = {
    columns: {
      render: {
        updatedAt: renderDate,
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

  useEffect(() => {
    handleTagsList();
  }, [currentPage]);

  const handleTagsList = async (e) => {
    setLoading(true);
    const res = await getCustomTagsList();
    if (res?.status) {
      const data = res.data;
      setTagsData(data);
    }
    setLoading(false);
  };

  const handleDelete = async (e) => {
    const params = {
      id: deleteId.id,
    };
    setLoading(true);
    const res = await deleteCustomTags(params);
    setCurrentPage(1);
    if (res?.status) {
      toast.success(res?.message);
      setShowModal(false);
      handleTagsList();
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
            text: 'custom tags',
          }}
        />
      )}

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
            <Card className="bg-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h4 className="fw-bold mb-0">Custom Tags </h4>
                  <div className="common_btn text-white px-3 py-1 rounded-2 cursor_pointer" onClick={() => setShow(true)}>
                    <FontAwesomeIcon icon={faPlusCircle} width={16} height={16} className="me-1" /> Add
                  </div>
                </div>

                {(!loading && tagsData && (
                  <CustomDataTable
                    rows={tagsData}
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

export default CustomTags;
