// src/App.js
import React, { useRef, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Nav, Tab, Card } from 'react-bootstrap';
import QRCodeStyling from 'qr-code-styling';

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  type: "svg",
  data: "",
  image: "",
  dotsOptions: {
    color: "#000000",
    type: "rounded"
  },
  backgroundOptions: {
    color: "#ffffff",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10
  }
});

const App = () => {
  const qrRef = useRef(null);
  const updateTimeout = useRef(null);

  const [qrType, setQrType] = useState('url');
  const [inputValues, setInputValues] = useState({});
  const [formFields, setFormFields] = useState({});
  const [dotColor, setDotColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  useEffect(() => {
    qrCode.append(qrRef.current);
  }, []);

  useEffect(() => {
    // Debounce QR code update
    if (updateTimeout.current) clearTimeout(updateTimeout.current);

    updateTimeout.current = setTimeout(() => {
      qrCode.update({
        data: generateQrData(qrType),
        dotsOptions: { color: dotColor },
        backgroundOptions: { color: bgColor }
      });
    }, 250);

    return () => clearTimeout(updateTimeout.current);
  }, [qrType, inputValues, formFields, dotColor, bgColor]);

  const generateQrData = (type) => {
    switch (type) {
      case 'url':
      case 'text':
      case 'pdf':
      case 'multiurl':
      case 'address':
      case 'contact':
        return inputValues[type] || '';
      case 'email':
        return `mailto:${formFields.email || ''}?subject=${formFields.subject || ''}&body=${formFields.body || ''}`;
      case 'sms':
        return `SMSTO:${formFields.phone || ''}:${formFields.message || ''}`;
      case 'tel':
        return `tel:${formFields.phone || ''}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${formFields.lastName || ''};${formFields.firstName || ''}\nFN:${formFields.firstName || ''} ${formFields.lastName || ''}\nORG:${formFields.organization || ''}\nTITLE:${formFields.position || ''}\nTEL;WORK:${formFields.workPhone || ''}\nTEL;HOME:${formFields.privatePhone || ''}\nTEL;CELL:${formFields.mobile || ''}\nTEL;FAX;WORK:${formFields.workFax || ''}\nTEL;FAX;HOME:${formFields.privateFax || ''}\nEMAIL:${formFields.email || ''}\nURL:${formFields.website || ''}\nADR:;;${formFields.street || ''};${formFields.city || ''};${formFields.state || ''};${formFields.zipcode || ''};${formFields.country || ''}\nEND:VCARD`;
      case 'mecard':
        return `MECARD:N:${formFields.firstName || ''},${formFields.lastName || ''};NICKNAME:${formFields.nickname || ''};TEL:${formFields.phone1 || ''},${formFields.phone2 || ''},${formFields.phone3 || ''};EMAIL:${formFields.email || ''};URL:${formFields.website || ''};BDAY:${formFields.birthday || ''};ADR:;;${formFields.street || ''};${formFields.city || ''};${formFields.state || ''};${formFields.zipcode || ''};${formFields.country || ''};NOTE:${formFields.notes || ''};;`;
      case 'event':
        return `BEGIN:VEVENT\nSUMMARY:${formFields.title || ''}\nDESCRIPTION:${formFields.description || ''}\nLOCATION:${formFields.location || ''}\nDTSTART:${formFields.start || ''}\nDTEND:${formFields.end || ''}\nEND:VEVENT`;
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    setInputValues({ ...inputValues, [qrType]: e.target.value });
  };

  const handleFormChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  // const download = (ext) => {
  //   qrCode.download({ extension: ext });
  // };
  const download = (ext) => {
    qrCode.update({
      data: generateQrData(qrType),
      dotsOptions: { color: dotColor },
      backgroundOptions: { color: bgColor }
    });
    // small timeout to ensure update completes before download
    setTimeout(() => {
      qrCode.download({ extension: ext });
    }, 100);
  };

  const renderFields = () => {
    switch (qrType) {
      case 'email':
        return (
          <>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Subject</Form.Label>
              <Form.Control name="subject" type="text" onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Message</Form.Label>
              <Form.Control name="body" as="textarea" onChange={handleFormChange} />
            </Form.Group>
          </>
        );
      case 'sms':
        return (
          <>
            <Form.Group className="mb-2">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control name="phone" type="tel" onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Message</Form.Label>
              <Form.Control name="message" as="textarea" onChange={handleFormChange} />
            </Form.Group>
          </>
        );
      case 'tel':
        return (
          <Form.Group className="mb-2">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control name="phone" type="tel" onChange={handleFormChange} />
          </Form.Group>
        );
      case 'vcard':
        return ['firstName', 'lastName', 'organization', 'position', 'workPhone', 'privatePhone', 'mobile', 'workFax', 'privateFax', 'email', 'website', 'street', 'zipcode', 'city', 'state', 'country'].map(field => (
          <Form.Group key={field} className="mb-2">
            <Form.Label>{field}</Form.Label>
            <Form.Control name={field} type="text" onChange={handleFormChange} />
          </Form.Group>
        ));
      case 'mecard':
        return ['firstName', 'lastName', 'nickname', 'phone1', 'phone2', 'phone3', 'email', 'website', 'birthday', 'street', 'zipcode', 'city', 'state', 'country', 'notes'].map(field => (
          <Form.Group key={field} className="mb-2">
            <Form.Label>{field}</Form.Label>
            <Form.Control name={field} type="text" onChange={handleFormChange} />
          </Form.Group>
        ));
      case 'event':
        return ['title', 'description', 'location', 'start', 'end'].map(field => (
          <Form.Group key={field} className="mb-2">
            <Form.Label>{field}</Form.Label>
            <Form.Control name={field} type="text" onChange={handleFormChange} />
          </Form.Group>
        ));
      default:
        return (
          <Form.Group className="mb-3">
            <Form.Label>Data</Form.Label>
            <Form.Control
              type="text"
              value={inputValues[qrType] || ''}
              onChange={handleInputChange}
              placeholder={`Enter ${qrType} data`}
            />
          </Form.Group>
        );
    }
  };

  const qrTypes = [
    { key: 'url', label: 'URL' },
    { key: 'text', label: 'Text' },
    { key: 'email', label: 'Email' },
    { key: 'sms', label: 'SMS' },
    { key: 'tel', label: 'Phone' },
    { key: 'vcard', label: 'vCard' },
    { key: 'mecard', label: 'MeCard' },
    { key: 'event', label: 'Event' },
    { key: 'multiurl', label: 'Multi URL' },
    { key: 'pdf', label: 'PDF' },
    { key: 'address', label: 'Address' },
    { key: 'contact', label: 'Contact' }
  ];

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4 fw-bold">QR Code Generator</h2>
      <Tab.Container activeKey={qrType} onSelect={setQrType}>
        <Row>
          <Col md={3} className="mb-4">
            <Nav variant="pills" className="flex-column">
              {qrTypes.map(({ key, label }) => (
                <Nav.Item key={key}>
                  <Nav.Link eventKey={key}>{label}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col md={5}>
            <Card className="mb-3 p-3">
              <Card.Body>
                {renderFields()}
                <Form.Group className="mb-3">
                  <Form.Label>Dot Color</Form.Label>
                  <Form.Control type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Background Color</Form.Label>
                  <Form.Control type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Logo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        // Update image immediately
                        qrCode.update({ image: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
            <Card className="p-3">
              <Card.Body className="d-flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => download('png')}>Download PNG</Button>
                <Button variant="secondary" onClick={() => download('jpg')}>Download JPG</Button>
                <Button variant="success" onClick={() => download('webp')}>Download WEBP</Button>
                <Button variant="dark" onClick={() => download('svg')}>Download SVG</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="d-flex justify-content-center align-items-center">
            <Card className="p-3 shadow">
              <div ref={qrRef} />
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default App;
