import React from 'react';
import {
  Container,
  Content,
  Modal,
  Button,
  Row,
  Col,
  Panel,
  Form,
  FormGroup,
  FormControl,
  Alert,
  Loader,
} from 'rsuite';
import { parseCookies } from 'nookies';

import Header from '../components/Header';

export default function Manuals() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [manuals, setManuals] = React.useState([]);

  React.useEffect(() => {
    getManuals();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const addManual = async (form) => {
    setLoading(true);
    const url = `api/manuals/create`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getManuals();
          toggleModal();
          Alert.info('Manual created successfully', 5000);
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const save = (e) => {
    let user = isLoggedIn();
    let form = { user: user.id },
      fields = [];
    fields = document.querySelectorAll('.inputs');
    fields.forEach((item) => {
      let name = item.name,
        value = item.value;
      form[name] = value;
    });

    addManual(form);
  };

  const getManuals = async () => {
    setLoading(true);
    const url = `api/manuals?page=1&limit=1000`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setManuals(res.data);
          setLoading(false);
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const isLoggedIn = () => {
    let user = parseCookies();
    user = user && user._auth ? JSON.parse(user._auth) : {};
    return user;
  };

  const user = isLoggedIn();

  const manual = manuals.map((item, key) => (
    <Col xs={24} sm={24} lg={8} key={key}>
      <Panel
        shaded
        bordered
        bodyFill
        style={{
          display: 'inline-block',
          backgroundColor: '#fff',
          width: '100%',
          marginBottom: 15,
        }}
      >
        <div className="org-card">
          <h3>{item.title}</h3>
          <br />
          <br />
          <p style={{ height: 50 }}>{item.description}</p>
          <br />
          <Button href={`/m/${item.slug}`} block>
            View &rarr;
          </Button>
        </div>
      </Panel>
    </Col>
  ));
  return (
    <div className="show-fake-browser navbar-page">
      <Modal show={modal} onHide={toggleModal}>
        <Form fluid onSubmit={save}>
          <Modal.Body>
            <FormGroup>
              <FormControl type="text" placeholder="Manual Title" className="inputs" name="title" />
            </FormGroup>
            <FormGroup>
              <FormControl
                rows={5}
                name="textarea"
                componentClass="textarea"
                placeholder="Manual Description"
                className="inputs"
                name="description"
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" appearance="primary" loading={loading}>
              Save
            </Button>
            <Button onClick={toggleModal} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Container>
        <Header title="Manual" />

        <Content className="container">
          <br />
          <br />
          <h3>
            Manuals &nbsp;&nbsp; &nbsp;
            {user.role !== 'reader' ? (
              <Button appearance="default" onClick={toggleModal}>
                + New
              </Button>
            ) : (
              ''
            )}
          </h3>
          <br />
          <br />
          <center style={{ display: loading ? 'block' : 'none' }}>
            <Loader size="md" />
          </center>
          <Row style={{ display: manual.length ? 'block' : 'none' }}>{manual}</Row>
        </Content>
      </Container>
    </div>
  );
}
