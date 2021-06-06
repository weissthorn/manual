import React from 'react';
import {
  Button,
  Panel,
  PanelGroup,
  Divider,
  Icon,
  IconButton,
  Row,
  Col,
  Modal,
  Input,
  InputGroup,
  Alert,
} from 'rsuite';

import Header from '../../components/ManualHeader';
import Editor from '../../components/Editor';
import Link from 'next/link';

export default class Manual extends React.Component {
  constructor(props) {
    super(props);
    this.admin = props.store.user;
    this.manual = props.store.manual;
    this.content = props.store.content;
    this.section = props.store.section;
    this.state = {
      modal: false,
      modal2: false,
      modal3: false,
      modal4: false,
      search: false,
      searchValue: '',
      active: '',
      section: '',
      notify: '',
    };
  }

  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  toggleModal2 = () => {
    this.setState({ modal2: !this.state.modal2 });
  };

  toggleModal3 = () => {
    this.setState({ modal3: !this.state.modal3 });
  };

  toggleModal4 = () => {
    this.setState({ modal4: !this.state.modal4 });
  };

  toggleSearch = () => {
    this.setState({ search: !this.state.search });
  };

  search = (val) => {
    this.setState({ search: true, searchValue: val });
    if (val.length) {
      //  this.content.searchManual(val)
    } else {
      this.setState({ search: false });
    }
  };

  user = () => {
    let user = localStorage.getItem('_aut');
    user = user ? JSON.parse(user) : '';
    return user;
  };

  getContent = (contents, title) => {
    contents = contents.slice().reverse();
    let url = contents.map((item, key) => (
      <Link to={`/m/${title}#${item.slug}`} id={`${item.slug}`} key={key}>
        {item.title}
      </Link>
    ));

    return url;
  };

  loadManual = () => {
    let hash = window.location.href;
    hash = hash.split('#');

    if (hash.length === 2) {
      this.content.getContent(hash[1]);
    } else {
      this.content.setContent({
        heading: this.manual.manual.title,
        description: this.manual.manual.description,
      });
    }
  };

  addSection = () => {
    if (!this.state.section) {
      this.setState({ notify: 'Section title is empty!' });
    } else {
      this.setState({ notify: '' });
      const data = {
        title: this.state.section,
        manualId: this.manual.manual.id,
        user: this.user().id,
      };

      this.section.addSection(data);
      setTimeout(() => {
        if (this.section.success) {
          Alert.info('Section added', 5000);
          this.getManual();
          this.toggleModal();
        }
      }, 3000);
    }
  };

  getManual = () => {
    let url = window.location.href;
    url = url.split('/');
    this.manual.getManual(url[4]);
  };

  componentDidMount() {
    this.getManual();

    setTimeout(() => {
      this.loadManual();
      let hash = window.location.href;
      hash = hash.split('#');
      if (hash.length === 2) {
        this.setState({ active: hash[1] });
        document.getElementById(hash[1]).classList.add('active');
      }
    }, 3000);
  }

  render() {
    const { modal, modal2, modal3, modal4, search, searchValue } = this.state;
    const { manual } = this.manual;
    const { content } = this.content;

    const user = this.user();

    let sections = manual && manual.sections ? manual.sections : [];
    sections = sections.map((item, key) => (
      <Panel header={item.title} defaultExpanded key={key}>
        {this.getContent(item.contents, manual.slug)}
        <IconButton
          appearance="subtle"
          icon={<Icon icon="plus" />}
          placement="left"
          onClick={this.toggleModal3}
        >
          Add content
        </IconButton>
      </Panel>
    ));

    return (
      <div className="show-fake-browser navbar-page">
        <div
          className="custom-modal"
          style={{ display: search ? 'block' : 'none' }}
          onClick={this.toggleSearch}
        >
          &nbsp;
        </div>

        <Modal show={modal} onHide={this.toggleModal}>
          <Modal.Header>
            <Modal.Title>Add section</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ color: '#cb0000' }}>{this.state.notify}</p>
            <br />
            <Input
              type="text"
              placeholder="Section Title"
              onChange={(section) => this.setState({ section })}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.addSection} appearance="primary" loading={this.section.loading}>
              Save
            </Button>
            <Button onClick={this.toggleModal} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal full overflow={true} show={modal3} onHide={this.toggleModal3}>
          <Modal.Header>
            <Modal.Title>Add content</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={9}>
                <Input type="text" placeholder="Content Title" /> <br />
                <Editor />
              </Col>
              <Col xsOffset={1} xs={12}>
                <h3>Preview</h3>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close} appearance="primary">
              Save
            </Button>
            <Button onClick={this.toggleModal3} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="side-menu">
          <div className="inner">
            <h4>{manual.title}</h4>
            <IconButton
              appearance="subtle"
              icon={<Icon icon="plus" />}
              placement="left"
              onClick={this.toggleModal}
            >
              Add section
            </IconButton>
            <PanelGroup accordion>{sections}</PanelGroup>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <div className="search">
              <InputGroup inside>
                <InputGroup.Addon>
                  <Icon icon="search" />
                </InputGroup.Addon>
                <Input
                  size={'lg'}
                  placeholder={`Search manual....`}
                  onChange={this.search}
                  value={searchValue}
                />
              </InputGroup>
            </div>

            <Header />
          </div>
          <div className="search-result" style={{ display: search ? 'block' : 'none' }}>
            <p>
              data Listening for intracluster connections on port 29015 Listening for client driver
              connections on port 28015 Listening for administrative HTTP connections on port 8080
              Listening on cluster addresses: 127.0.0.1, 192.168.0.128, ::1, fe80::1%1,
              fe80::18bb:fe9c:ca4d:6e77%5, fe80::195c:b6c8:6b75:91bd%16,
              fe80::387c:abf2:2f19:dd78%13, fe80::497b:ab5b:9034:300f%15,{' '}
            </p>
          </div>

          <div className="inner">
            <div
              className=""
              style={{
                display:
                  user &&
                  user.role !== 'reader' &&
                  manual &&
                  manual.sections &&
                  manual.sections.length
                    ? 'block'
                    : 'none',
              }}
            >
              <IconButton appearance="subtle" icon={<Icon icon="pencil" />} placement="left">
                Edit section
              </IconButton>
              <IconButton appearance="subtle" icon={<Icon icon="pencil" />} placement="left">
                Edit content
              </IconButton>
            </div>
            <span className="space-20" />
            <div>
              <h3>{content ? content.heading : ''}</h3>
              <p>{content ? content.description : ''}</p>
            </div>
          </div>

          <div
            className="footer"
            style={{
              display:
                user &&
                user.role !== 'reader' &&
                manual &&
                manual.sections &&
                manual.sections.length
                  ? 'block'
                  : 'none',
            }}
          >
            <Divider />
            <IconButton appearance="subtle" icon={<Icon icon="chevron-left" />} placement="left">
              Pause
            </IconButton>
            <IconButton
              appearance="subtle"
              icon={<Icon icon="chevron-right" />}
              placement="right"
              style={{ float: 'right' }}
            >
              Next
            </IconButton>
          </div>
        </div>

        {/* <Content className="container">
            <span className="space-50" />
          </Content> */}
      </div>
    );
  }
}
