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
import { parseCookies } from 'nookies';
import Header from '../../../components/ManualHeader';
import Editor from '../../../components/Editor';
import Link from 'next/link';
import { useRouter } from 'next/router';
import moment from 'moment';
import DOMPurify from 'dompurify';

export default function Manual() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [modal3, setModal3] = React.useState(false);
  const [modal4, setModal4] = React.useState(false);
  const [result, setResult] = React.useState([]);
  const [search, setSearch] = React.useState();
  const [notify, setNotify] = React.useState();
  const [manual, setManual] = React.useState({});
  const [title, setTitle] = React.useState();
  const [content, setContent] = React.useState();
  const [section, setSection] = React.useState();
  const [sectionId, setSectionId] = React.useState();
  const [menu, setMenu] = React.useState(false);

  React.useEffect(() => {
    if (!router.isReady) return;
    getManual();
  }, [router.isReady]);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleModal2 = () => {
    setModal2(!modal2);
  };

  const toggleModal3 = (e) => {
    let id = e.target.id;
    if (id) {
      setSectionId(id);
    } else {
      setTitle();
      setContent();
    }
    setModal3(!modal3);
  };

  const toggleModal4 = () => {
    setModal4(!modal4);
  };

  const toggleSearch = () => {
    setSearch(!search);
  };

  const searchContent = (val) => {
    setSearch(true);
    if (val.length) {
      searchManual(val);
    } else {
      setSearch(false);
    }
  };

  const searchManual = async (q) => {
    setLoading(true);
    const url = `/api/search?query=${q}&manualId=${manual.id}`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          setResult(res.data);
          setNotify('');
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const getContent = (contents, title) => {
    const { chapter } = router.query;
    contents = contents && contents.length ? contents : [];
    contents = contents
      .sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
      .reverse();
    let url = contents.map((item, key) => (
      <a
        href={`/m/${title}/${item.slug}`}
        id={`${item.slug}`}
        key={key}
        className={`${chapter === item.slug ? 'active' : ''}`}
      >
        {item.title}
      </a>
    ));

    return url;
  };

  const getSearch = (contents, title) => {
    const { chapter } = router.query;
    contents = contents && contents.length ? contents : [];
    contents = contents
      .sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
      .reverse();
    let url = contents.map((item, key) => (
      <div key={key}>
        <a
          href={`/m/${title}/${item.slug}`}
          id={`${item.slug}`}
          className={`${chapter === item.slug ? 'active' : ''}`}
          style={{ paddingLeft: 5 }}
        >
          {item.title}
        </a>
      </div>
    ));

    return url;
  };

  const saveSection = async (form) => {
    setLoading(true);
    const url = `/api/sections/create`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getManual();
          setNotify('');
          toggleModal();
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const addSection = () => {
    if (!section) {
      setNotify('Section title is empty!');
    } else {
      setNotify('');
      const data = {
        title: section,
        manualId: manual.id,
        user: user.id,
      };

      saveSection(data);
    }
  };

  const saveContent = async (form) => {
    setLoading(true);
    const url = `/api/content/create`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          router.push(`/m/${manual.slug}/${res.data.slug}`);
          setNotify('');
          setTitle();
          setContent();
          setModal3(false);
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const addContent = () => {
    if (!title) {
      setNotify('Content title is empty!');
    } else if (!content) {
      setNotify('Content is empty!');
    } else {
      setNotify('');
      const data = {
        title,
        content,
        sectionId,
        user: user.id,
      };

      saveContent(data);
    }
  };

  const handleTitle = (val) => {
    setTitle(val);
  };

  const handleContent = (val) => {
    val = DOMPurify.sanitize(val);
    setContent(val);
  };

  const getManual = async () => {
    const { slug } = router.query;

    setLoading(true);
    const url = `/api/manuals/${slug}`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          setManual(res.data);
          setNotify('');
        } else {
          if (res.error === 'Unable to get manual.') {
            router.push('/404');
          }
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

  let sections = manual && manual.sections ? manual.sections : [];
  sections = sections
    .sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
    .reverse();
  sections = sections.map((item, key) => (
    <Panel defaultExpanded={item.contents.length ? true : false} header={item.title} key={key}>
      {getContent(item.contents, manual.slug)}
      <IconButton
        size="xs"
        appearance="subtle"
        icon={<Icon icon="plus" />}
        placement="left"
        id={item.id}
        onClick={toggleModal3}
        style={{ display: user.role !== 'reader' ? 'block' : 'none' }}
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
        onClick={toggleSearch}
      >
        &nbsp;
      </div>
      <div className="custom-modal" style={{ display: menu ? 'block' : 'none' }}>
        <div className="side-menu mobile">
          <div className="inner">
            <h4>
              {manual.title}{' '}
              <span className="icon-menu" onClick={toggleMenu}>
                <Icon icon="close" size={'2x'} />
              </span>
            </h4>
            <IconButton
              appearance="subtle"
              icon={<Icon icon="plus" />}
              placement="left"
              onClick={toggleModal}
              style={{ display: user && user.role !== 'reader' ? 'block' : 'none' }}
            >
              Add section
            </IconButton>
            <PanelGroup accordion>{sections}</PanelGroup>
          </div>
        </div>
      </div>

      <Modal show={modal} onHide={toggleModal}>
        <Modal.Header>
          <Modal.Title>Add section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: '#cb0000' }}>{notify}</p>
          <br />
          <Input type="text" placeholder="Section Title" onChange={(value) => setSection(value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addSection} appearance="primary" loading={loading}>
            Save
          </Button>
          <Button onClick={toggleModal} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal full overflow={true} show={modal3} onHide={toggleModal3}>
        <Modal.Header>
          <Modal.Title>Add content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={9}>
              <Input type="text" placeholder="Content Title" onChange={handleTitle} /> <br />
              <Editor onChange={handleContent} />
            </Col>
            <Col xsOffset={1} xs={12}>
              <h4>{title}</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addContent} loading={loading} appearance="primary">
            Save
          </Button>
          <Button onClick={toggleModal3} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="side-menu">
        <div className="inner">
          <span className="menu mobile" onClick={toggleMenu}>
            <Icon icon="bars" size={'2x'} />
          </span>
          <div className="desktop">
            <h4>{manual.title}</h4>
            <IconButton
              appearance="subtle"
              icon={<Icon icon="plus" />}
              placement="left"
              onClick={toggleModal}
              style={{ display: user && user.role !== 'reader' ? 'block' : 'none' }}
            >
              Add section
            </IconButton>
            <PanelGroup accordion>{sections}</PanelGroup>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="header">
          <div className="search">
            <InputGroup inside>
              <InputGroup.Addon>
                <Icon icon="search" />
              </InputGroup.Addon>
              <Input size={'lg'} placeholder={`Search manual....`} onChange={searchContent} />
            </InputGroup>
          </div>

          <Header />
        </div>
        <div className="search-result" style={{ display: search ? 'block' : 'none' }}>
          {result
            .sort((a, b) => b.contents.length - a.contents.length)
            .map((item, key) => (
              <div key={key} className="result">
                <Row>
                  <Col xs={24} lg={8}>
                    <h5>{item.title}</h5>
                  </Col>
                  <Col xs={24} lg={16} style={{ borderLeft: '1px solid #ccc' }}>
                    {getSearch(item.contents, manual.slug)}
                  </Col>
                </Row>
              </div>
            ))}
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
              Edit manual
            </IconButton>
          </div>
          <span className="space-20" />
          <div>
            <h3>{manual ? manual.title : ''}</h3>
            <p>{manual ? manual.description : ''}</p>
          </div>
        </div>

        <div
          className="footer"
          style={{
            display:
              user && user.role !== 'reader' && manual && manual.sections && manual.sections.length
                ? 'block'
                : 'none',
          }}
        >
          <Divider />
          <IconButton appearance="subtle" icon={<Icon icon="chevron-left" />} placement="left">
            Previous
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
    </div>
  );
}
