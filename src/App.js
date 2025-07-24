// src/App.js
import React, { useRef, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Nav, Tab, Card, Navbar } from 'react-bootstrap';
import QRCodeStyling from 'qr-code-styling';
import './App.css';

const qrCode = new QRCodeStyling({
  width: 200,
  height: 200,
  type: 'svg',
  data: '',
  image: '',
  dotsOptions: {
    color: '#000000',
    type: 'rounded'
  },
  backgroundOptions: {
    color: '#ffffff'
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 10
  },
  qrOptions: {
    errorCorrectionLevel: 'M'
  }
});

const App = () => {
  const qrRef = useRef(null);
  const [qrType, setQrType] = useState('url');
  const [inputValues, setInputValues] = useState({});
  const [formFields, setFormFields] = useState({});
  const [dotColor, setDotColor] = useState('#000000');
  const [dotColor2, setDotColor2] = useState('#000000');
  const [useGradient, setUseGradient] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dotStyle, setDotStyle] = useState('rounded');
  const [isQrVisible, setIsQrVisible] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M');

  useEffect(() => {
    if (qrRef.current) qrCode.append(qrRef.current);
  }, []);

  useEffect(() => {
    try {
      const data = generateQrData(qrType);
      if (data) {
        setIsQrVisible(true);
        qrCode.update({
          data,
          dotsOptions: {
            color: useGradient ? undefined : dotColor,
            gradient: useGradient ? {
              type: 'linear',
              rotation: 0,
              colorStops: [
                { offset: 0, color: dotColor },
                { offset: 1, color: dotColor2 }
              ]
            } : undefined,
            type: dotStyle
          },
          backgroundOptions: { color: bgColor },
          qrOptions: { errorCorrectionLevel }
        });
      } else {
        setIsQrVisible(false);
      }
    } catch (err) {
      setIsQrVisible(false);
    }
  }, [qrType, inputValues, formFields, dotColor, dotColor2, useGradient, dotStyle, bgColor, errorCorrectionLevel]);

  const generateQrData = (type) => {
    switch (type) {
      case 'url':
      case 'text':
      // case 'pdf':
      // case 'multiurl':
      case 'address':
      case 'contact':
        return `contact:${formFields.firstName || ''};${formFields.lastName || ''};${formFields.email || ''};${formFields.phone || ''};${formFields.address || ''}`;
      case 'email':
        return `mailto:${formFields.email}?subject=${formFields.subject}&body=${formFields.body}`;
      case 'sms':
        return `SMSTO:${formFields.phone}:${formFields.message}`;
      case 'tel':
        return `tel:${(formFields.countryCode || '') + (formFields.areaCode || '') + (formFields.phone || '')}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${formFields.lastName};${formFields.firstName}\nFN:${formFields.firstName} ${formFields.lastName}\nORG:${formFields.organization}\nTITLE:${formFields.position}\nTEL;WORK:${formFields.workPhone}\nTEL;HOME:${formFields.privatePhone}\nTEL;CELL:${formFields.mobile}\nTEL;FAX;WORK:${formFields.workFax}\nTEL;FAX;HOME:${formFields.privateFax}\nEMAIL:${formFields.email}\nURL:${formFields.website}\nADR:;;${formFields.street};${formFields.city};${formFields.state};${formFields.zipcode};${formFields.country}\nEND:VCARD`;
      case 'mecard':
        return `MECARD:N:${formFields.firstName},${formFields.lastName};NICKNAME:${formFields.nickname};TEL:${formFields.phone1},${formFields.phone2},${formFields.phone3};EMAIL:${formFields.email};URL:${formFields.website};BDAY:${formFields.birthday};ADR:;;${formFields.street};${formFields.city};${formFields.state};${formFields.zipcode};${formFields.country};NOTE:${formFields.notes};;`;
      case 'event':
      case 'calendar':
        return `BEGIN:VEVENT\nSUMMARY:${formFields.title}\nDESCRIPTION:${formFields.description}\nLOCATION:${formFields.location}\nDTSTART:${formFields.start}\nDTEND:${formFields.end}\nEND:VEVENT`;
      case 'whatsapp':
        return `https://wa.me/${formFields.phone}?text=${encodeURIComponent(formFields.message)}`;
      case 'wifi':
        return `WIFI:T:${formFields.encryption};S:${formFields.ssid};P:${formFields.password};;`;
      default:
        return '';
    }
  };

  const download = (ext) => {
    qrCode.update({
      data: generateQrData(qrType),
      dotsOptions: {
        color: useGradient ? undefined : dotColor,
        gradient: useGradient ? {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: dotColor },
            { offset: 1, color: dotColor2 }
          ]
        } : undefined,
        type: dotStyle
      },
      backgroundOptions: { color: bgColor },
      qrOptions: { errorCorrectionLevel }
    });
    setTimeout(() => qrCode.download({ extension: ext }), 100);
  };

  const handleFormChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    setInputValues({ ...inputValues, [qrType]: e.target.value });
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
    // { key: 'multiurl', label: 'Multi URL' },
    // { key: 'pdf', label: 'PDF' },
    { key: 'address', label: 'Address' },
    { key: 'contact', label: 'Contact' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'wifi', label: 'WiFi' },
    { key: 'calendar', label: 'Calendar' }
  ];

  const renderFields = () => {
    const defaultField = (
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

    const fields = {
      email: ['Email', 'Subject', 'Body'],
      sms: ['Phone', 'Message'],
      contact: ['First Name', 'Last Name', 'Email', 'Phone', 'Address'],
      tel: ['Country Code', 'Area Code', 'Phone'],
      vcard: ['First Name', 'Last Name', 'Organization', 'Position', 'Work Phone', 'Private Phone', 'Mobile', 'Work Fax', 'Private Fax', 'Email', 'Website', 'Street', 'Zipcode', 'City', 'State', 'Country'],
      mecard: ['First Name', 'Last Name', 'Nick Name', 'Phone1', 'Phone2', 'Phone3', 'Email', 'Website', 'Birthday', 'Street', 'Zipcode', 'City', 'State', 'Country', 'Notes'],
      event: ['Title', 'Description', 'Location', 'Start', 'End'],
      whatsapp: ['Phone', 'Message'],
      wifi: ['SSID', 'Password', 'Encryption'],
      calendar: ['Title', 'Description', 'Location', 'Start', 'End']
    };

    if (fields[qrType]) {
      return (
        <Row>
          {fields[qrType].map(field => (
            <Col xs={12} md={4} key={field} className="mb-3">
              <Form.Group>
                <Form.Label>{field}</Form.Label>
                <Form.Control name={field} type="text" onChange={handleFormChange} />
              </Form.Group>
            </Col>
          ))}
        </Row>
      );
    }

    return defaultField;
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand href="#">QRLogo</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="px-3 box-bg">
        <Tab.Container activeKey={qrType} onSelect={setQrType}>
          <Nav variant="tabs" className="justify-content-center flex-wrap mb-3">
            {qrTypes.map(({ key, label }) => (
              <Nav.Item key={key}>
                <Nav.Link eventKey={key}>{label}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Row>
            <Col md={4} lg={8}>
              <Card className="mb-3 p-3">
                <Card.Body>{renderFields()}</Card.Body>
              </Card>
              <Card className="mb-3 p-3">
                <Form.Group className="mb-3">
                  <Form.Check type="checkbox" label="Use Gradient Colors" checked={useGradient} onChange={(e) => setUseGradient(e.target.checked)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Dot Color 1</Form.Label>
                  <Form.Control type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} />
                </Form.Group>
                {useGradient && (
                  <Form.Group className="mb-3">
                    <Form.Label>Dot Color 2</Form.Label>
                    <Form.Control type="color" value={dotColor2} onChange={(e) => setDotColor2(e.target.value)} />
                  </Form.Group>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Dot Style</Form.Label>
                  <Form.Select value={dotStyle} onChange={(e) => setDotStyle(e.target.value)}>
                    <option value="rounded">Rounded</option>
                    <option value="dots">Dots</option>
                    <option value="square">Square</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Background Color</Form.Label>
                  <Form.Control type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Error Correction Level</Form.Label>
                  <Form.Select value={errorCorrectionLevel} onChange={(e) => setErrorCorrectionLevel(e.target.value)}>
                    <option value="L">L (7%)</option>
                    <option value="M">M (15%)</option>
                    <option value="Q">Q (25%)</option>
                    <option value="H">H (30%)</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Logo</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => qrCode.update({ image: reader.result });
                    reader.readAsDataURL(file);
                  }} />
                </Form.Group>
              </Card>
             
            </Col>
            <Col md={8} lg={4} className="d-flex flex-column align-items-center">
              <div style={{ maxWidth: '400px', transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
                {isQrVisible ? <div ref={qrRef} /> : <p className="text-danger">QR code data is invalid or empty.</p>}
              </div>
              <div className="mt-3">
                <Button onClick={() => setZoomLevel(zoomLevel + 0.1)} className="me-2">Zoom In</Button>
                <Button onClick={() => setZoomLevel(Math.max(0.1, zoomLevel - 0.1))}>Zoom Out</Button>
              </div>
               <Card className="mt-3 p-3">
                <Button variant="primary" onClick={() => download('png')} className="me-2 mb-2">Download PNG</Button>
                <Button variant="secondary" onClick={() => download('jpg')} className="me-2 mb-2">Download JPG</Button>
                <Button variant="success" onClick={() => download('webp')} className="me-2 mb-2">Download WEBP</Button>
                <Button variant="dark" onClick={() => download('svg')} className="mb-2">Download SVG</Button>
              </Card>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
};

export default App;
