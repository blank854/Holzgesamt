import React, { useState, useEffect } from 'react'
import { Button, Form, Row, Col, ListGroup } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Layout from '../components/Layout'
import axios from 'axios'
import { useUser } from '../contexts/UserContext'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { useMessage } from '../contexts/MessageContext'

const createAdvert = () => {
  const { getUser } = useUser()
  const { setMessage, setVariant } = useMessage()
  const [priceType, setPriceType] = useState('')
  const [priceValue, setpriceValue] = useState('')
  const [file, setFile] = useState('')
  const [loading, setLoading] = useState(false)
  const [imgPaths, setImgPaths] = useState([])
  const [location, setLocation] = useState([])
  const [restricted, setRestricted] = useState(false)
  const [felled, setFelled] = useState(false)
  const [availableQualities, setAvailableQualities] = useState([
    'Gerade',
    'Schief',
    'Morsch',
    'Totholz',
  ])
  const [latinSpeciesColor, setLatinSpeciesColor] = useState('')
  const [selectedQualities, setSelectedQualities] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState('')
  const [species, setSpecies] = useState([])
  const [searchSpecies, setSearchSpecies] = useState([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [latinSpecies, setLatinSpecies] = useState('')

  const handleAddQuality = (Quality) => {
    let tmpSelectedQualities = selectedQualities.split(' ')
    tmpSelectedQualities.push(Quality)
    setSelectedQualities(tmpSelectedQualities.join(' '))
    console.log(tmpSelectedQualities)
  }
  const handleSelect = (e) => {
    setPriceType(e)
  }

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let tmpLocation = []
        tmpLocation.push(position.coords.latitude)
        tmpLocation.push(position.coords.longitude)
        setLocation(tmpLocation)
      })
    }
  }

  const handleCreateAdvert = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

    const offer = {
      title: formDataObj.title,
      description: formDataObj.description,
      price: {
        priceType: priceType,
        priceValue: formDataObj.price,
      },
      treeDetail: {
        species: {
          german: formDataObj.species,
          latin: formDataObj.latinSpecies,
        },
        dimensions: {
          height: formDataObj.height,
          circumference: formDataObj.circumference,
        },
        quality: formDataObj.quality,
        accessibility: formDataObj.accessibility,
        protectionState: formDataObj.protectionState,
        timeWindow: {
          restricted: formDataObj.restricted ? true : false,
          from: formDataObj.datefrom,
          to: formDataObj.dateto,
        },
        fellingState: {
          felled: formDataObj.felled ? true : false,
          fellingDate: formDataObj.fellingDate,
        },
      },
      pictures: imgPaths,
    }

    if (location.length > 0) {
      offer.treeDetail.location = {
        type: 'Point',
        coordinates: location,
      }
    } else {
      offer.treeDetail.location = {
        zip: formDataObj.zip,
      }
    }
    console.log(offer)

    const config = {
      method: 'post',
      url: 'http://localhost:4000/offer',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUser().token}`,
      },
      data: offer,
    }

    axios(config)
      .then(function (response) {
        setMessage('Inserat erfolgreich gespeichert')
        setVariant('success')
      })
      .catch(function (e) {
        setMessage(e.response.data.message)
        setVariant('danger')
      })
      .finally(() => {
        setpriceValue(e.target.reset())
        setPriceType(e.target.reset())
        setImgPaths([])
        setLatinSpecies(e.target.reset())
        setSelectedSpecies(e.target.reset())
        setSelectedQualities(e.target.reset())
        setRestricted(e.target.reset())
        setFelled(e.target.reset())
        e.target.reset()
        window.scrollTo(0, 0)
      })
  }

  const handleDropdownClick = (e) => {
    setPriceType(e.target.outerText)
  }

  const handleFileUpload = (e) => {

    setLoading(true)
    setFile(e.target.files[0])
  }

  const handleSearchSpecies = (e) => {
    setSelectedSpecies(e.target.value)
    let tmpSearchSpecies = species.filter((tree) =>
      tree.treeSpeciesGerman.includes(e.target.value)
    )
    setSearchSpecies(tmpSearchSpecies)
  }
  const handleOnBlur = (e) =>{
    if (e.relatedTarget){
      if (e.relatedTarget.parentElement.id !== "ListGroupSpecies"){
        setShowAutocomplete(false)
      }
    } else {
      setShowAutocomplete(false)
    }
  }
  const handleClickSpecies = (e) => {

    console.log(e)
    setSelectedSpecies(e)
    setShowAutocomplete(false)
  }

  const handleIdentify = (e) => {
    if (imgPaths.length > 0) {
      const config = {
        method: 'post',
        url: 'http://localhost:4000/identify',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          URL: imgPaths[0].access,
        },
      }
      console.log(config)
      axios(config)
        .then(function (response) {
          console.log(response)
          if (response.data.length > 0) {
            setLatinSpecies(response.data[0].species)
            setLatinSpeciesColor('bg-info text-white')
            setTimeout(function () {
              setLatinSpeciesColor('')
            }, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

  useEffect(() => {
    if (file === '') return
    let formData = new FormData()
    formData.append('Image', file)

    const config = {
      method: 'POST',
      url: 'http://localhost:4000/upload',
      headers: {
        Authorization: `Bearer ${getUser().token}`,
      },
      data: formData,
    }

    axios(config)
      .then((result) => {
        let tmpImgPaths = imgPaths
        tmpImgPaths.push({ access: result.data.link })
        setImgPaths(tmpImgPaths)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [file])

  useEffect(() => {
    setMessage('')

    const config = {
      method: 'get',
      url: 'http://localhost:4000/statistics/treeSpecies',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    axios(config).then((response) => {
      setSpecies(response.data.treeJSON)
      console.log(response.data.treeJSON)
    })
  }, [])

  return (
    <Layout>
      <div className='CreateAdvert'>
        <Form onSubmit={handleCreateAdvert}>
          <Row className='mt-3'>
            <Col md={12}>
              {/* <h4>Anzeigendetails</h4> */}
              {/* <div className='block-example border border-danger'> */}
              <div className='user p-4 rounded bg-light box-shadow'>
                <h5>Allgemeine Informationen</h5>
                <Form.Group
                  as={Row}
                  className='mb-3'
                  controlId='formHorizontalTitel'
                ></Form.Group>
                <Col sm={8}>
                  <Alert variant='info'>
                    Die mit <span className='text-danger'>*</span>{' '}
                    gekennzeichneten Felder sind Pflichtfelder und müssen
                    ausgefüllt werden. Je mehr Felder du ausfüllst, umso
                    wahrscheinlicher meldet sich ein Käufer.
                  </Alert>
                </Col>
                {/* </div> */}
                <Form.Group
                  as={Row}
                  className='mb-3'
                  controlId='formHorizontalTitel'
                ></Form.Group>

                <Form.Group
                  as={Row}
                  className='mb-3'
                  controlId='formHorizontalTitel'
                >
                  <Form.Label column sm={2}>
                    Titel <span className='text-danger'> * </span>
                  </Form.Label>

                  <Col sm={6}>
                    <Form.Control
                      type='titel'
                      placeholder='Titel'
                      name='title'
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className='mb-3'
                  controlId='formHorizontalDescription'
                >
                  <Form.Label column sm={2}>
                    Beschreibung <span className='text-danger'> * </span>
                  </Form.Label>
                  <Col sm={6}>
                    <FloatingLabel
                      controlId='floatingTextarea1'
                      label='Beschreibung'
                    >
                      <Form.Control
                        as='textarea'
                        placeholder='Leave a comment here'
                        name='description'
                        style={{ height: '100px' }}
                        required
                      />
                    </FloatingLabel>
                  </Col>
                  <Col s={3}>
                    <Alert variant='light'>
                      Tipp: Mit einer guten Beschreibung findest du schneller
                      einen Käufer.
                    </Alert>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className='mb-3'
                  controlId='formHorizontalPrice'
                >
                  <Form.Label column sm={2}>
                    Preis <span className='text-danger'> * </span>
                  </Form.Label>
                  <Col sm={2}>
                    <div className='d-flex'>
                      <Form.Control
                        style={{ minWidth: '150px' }}
                        type='price'
                        placeholder='Preis'
                        className='me-3'
                        name='price'
                        value={priceType === 'Geschenk' ? '0' : priceValue}
                        onChange={(e) => setpriceValue(e.target.value)}
                        required
                      />

                      <DropdownButton
                        id='dropdown-price'
                        title={priceType ? priceType : 'Preistyp'}
                        variant='dark'
                        onSelect={handleSelect}
                        aria-required
                      >
                        <Dropdown.Item
                          eventKey='Festpreis'
                          onClick={() => setPriceType()}
                        >
                          Festpreis
                        </Dropdown.Item>
                        <Dropdown.Item eventKey='Verhandlungsbasis'>
                          Verhandlungsbasis
                        </Dropdown.Item>
                        <Dropdown.Item eventKey='Geschenk'>
                          Geschenk
                        </Dropdown.Item>
                      </DropdownButton>
                    </div>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className='mb-3'
                  controlId='formHorizontalLocation'
                >
                  <Form.Label column sm={2}>
                    Standort <span className='text-danger'> * </span>
                  </Form.Label>
                  <Col sm={2}>
                    <div className='d-flex'>
                      <Form.Control
                        type='location'
                        placeholder='Postleitzahl'
                        className='me-3'
                        name='zip'
                        style={{ minWidth: '150px' }}
                      />
                      <i
                        className='fas fa-map-marker-alt fa-2x pointer'
                        onClick={handleLocate}
                      ></i>
                    </div>
                  </Col>
                  <Form.Text className='text-muted'>
                    Keine Sorge, wir werden den genauen Standort nicht
                    veröffentlichen. Es wird lediglich Ihre Stadt öffentlich
                    angezeigt.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId='formFile' className='mb-3 d-flex'>
                  <Form.Label column sm={2}>
                    Bilder
                  </Form.Label>
                  <Col sm={6} className='d-flex'>
                    <Form.Label className='fileUpload bg-dark rounded text-center border border-primary pointer text-primary d-flex justify-content-center align-items-center'>
                      <div>
                        <i className='fas fa-camera fa-4x'></i>
                      </div>
                    </Form.Label>
                    {imgPaths.map((imgPath, index) => (
                      <img
                        key={index}
                        src={imgPath.access}
                        className='rounded border border-primary ms-3'
                        style={{ height: '10rem' }}
                      />
                    ))}
                    <Form.Control
                      type='file'
                      name='file'
                      onChange={handleFileUpload}
                      className='d-none'
                    />
                  </Col>
                </Form.Group>
                <Form.Group controlId='formFile' className='mb-3 d-flex'>
                  <Form.Label column sm={2}></Form.Label>

                  <div className='d-flex align-items-center'>
                    <Button
                      variant='primary'
                      size='lg'
                      className='w-100'
                      onClick={handleIdentify}
                    >
                      Baum identifizieren
                    </Button>
                  </div>
                </Form.Group>
              </div>

              <div className='TreeDetail my-5'>
                <div className='user p-4 rounded bg-light box-shadow'>
                  <h5>Detailinformationen</h5>

                  <Form.Group
                    as={Row}
                    className='mb-3'
                    controlId='formHorizontalSpecies'
                  >
                    <Form.Label column sm={2}>
                      Baumspezies (lat.)
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        className={latinSpeciesColor}
                        type='species'
                        placeholder='Spezies'
                        name='latinSpecies'
                        value={latinSpecies}
                        onChange={(e) => setLatinSpecies(e.target.value)}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className='mb-3'
                    controlId='formHorizontalSpecies'
                  >
                    <Form.Label column sm={2}>
                      Baumspezies <span className='text-danger'> * </span>
                    </Form.Label>
                    <Col sm={6} className='position-relative'>
                      <Form.Control
                        type='species'
                        placeholder='Spezies'
                        name='species'
                        required
                        onFocus={() => setShowAutocomplete(true)}
                        onBlur={handleOnBlur}
                        onChange={handleSearchSpecies}
                        value={selectedSpecies}
                      />
                      <ListGroup
                        id="ListGroupSpecies"
                        className={`position-absolute w-100 ${
                          !showAutocomplete ? 'd-none' : ''
                        }`}
                      >
                        {searchSpecies.map((tree, index) => (
                          <ListGroup.Item
                            key={index}
                            onClick={() =>
                              handleClickSpecies(tree.treeSpeciesGerman)
                            }
                            tabIndex = "-1"
                            className='pointer'
                          >
                            {tree.treeSpeciesGerman}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className='d-flex'
                    controlId='formHorizontalDimension'
                  >
                    <Form.Label column sm={2}>
                      Dimension
                    </Form.Label>
                    <Col sm={5}>
                      <div className='d-flex'>
                        <Form.Control
                          type='height'
                          placeholder='Höhe'
                          name='height'
                          maxLength='150px'
                        />
                        <Form.Label column sm={2} className='text-center'>
                          Meter
                        </Form.Label>
                        <Form.Control
                          type='circumference'
                          placeholder='Umfang'
                          name='circumference'
                        />
                        <Form.Label column sm={2} className='text-center'>
                          Zentimeter
                        </Form.Label>
                      </div>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className='mb-3'
                    controlId='formempty'
                  ></Form.Group>
                  <Form.Group
                    as={Row}
                    className='mb-3'
                    controlId='formHorizontalQuality'
                  >
                    <Form.Label column sm={2}>
                      Qualität
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type='quality'
                        placeholder='Qualität'
                        name='quality'
                        onChange={(e) => setSelectedQualities(e.target.value)}
                        value={selectedQualities}

                        // onClick={() => handleAddQuality(selectedQualities)}
                        // value={selectedQualities}
                      />
                      {/* {selectedQualities.join(',')} */}
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className='mb-3'
                    controlId='qualityoptions'
                  >
                    <Form.Label column sm={2}></Form.Label>
                    <Col sm={6}>
                      <div className='my-3 '>
                        {availableQualities.map((availableQuality, index) => (
                          <span
                            className='bg-primary px-3 py-2 me-3 rounded text-white pointer'
                            key={index}
                            onClick={() => handleAddQuality(availableQuality)}
                          >
                            {availableQuality}
                          </span>
                        ))}
                      </div>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className='mb-3'
                    controlId='formHorizontalAccessibility'
                  >
                    <Form.Label column sm={2}>
                      Erreichbarkeit
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type='accessibility'
                        placeholder='Erreichbarkeit'
                        name='accessibility'
                      />
                    </Col>
                  </Form.Group>
                </div>
                <div className='Timewindow my-5'>
                  <div className='user p-4 rounded bg-light box-shadow'>
                    <h5>Zeitfenster</h5>
                    <Form.Group
                      as={Row}
                      className='mb-3'
                      controlId='formHorizontalTimeWindow'
                    >
                      <div className='d-flex'>
                        <Form.Label column sm={2} className='d-flex'>
                          Eingeschränkt
                        </Form.Label>
                        <Col sm={6}>
                          <Form.Check
                            type='switch'
                            id='custom-switch'
                            name='restricted'
                            onChange={() => setRestricted(!restricted)}
                            value={restricted}
                          />
                        </Col>
                        <span className='align-botton'></span>
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className='mb-3'
                      controlId='formHorizontalTimeFrom'
                    >
                      {restricted ? (
                        <Form.Label column sm={2}>
                          Von
                        </Form.Label>
                      ) : (
                        ''
                      )}
                      <Col sm={5}>
                        <div className='d-flex'>
                          {restricted ? (
                            <>
                              <Form.Group controlId='datefrom'>
                                <Form.Control
                                  type='date'
                                  name='datefrom'
                                  placeholder='Due date'
                                  maxLength='150px'
                                />
                              </Form.Group>

                              <Form.Label column sm={2} className='text-center'>
                                Bis
                              </Form.Label>

                              <Form.Group controlId='dateto'>
                                <Form.Control
                                  type='date'
                                  name='dateto'
                                  placeholder='Due date'
                                  maxWidth='150px'
                                />
                              </Form.Group>
                            </>
                          ) : (
                            ''
                          )}
                        </div>
                      </Col>
                    </Form.Group>
                  </div>
                </div>
                <div className='Treestatus my-5'>
                  <div className='user p-4 rounded bg-light box-shadow'>
                    <h5>Status des Baumes</h5>
                    <Form.Group
                      as={Row}
                      className='mb-3'
                      controlId='formHorizontalprotectionState'
                    >
                      <Form.Label column sm={2}>
                        Schutzstatus
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type='protectionState'
                          placeholder='Schutzstatus'
                          name='protectionState'
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className='mb-3'
                      controlId='formHorizontalfellingState'
                    >
                      <div className='d-flex'>
                        <Form.Label column sm={2} className='d-flex'>
                          Baum gefällt?
                        </Form.Label>
                        <Col sm={6}>
                          <Form.Check
                            type='switch'
                            id='custom-switch'
                            label=''
                            name='felled'
                            onChange={() => setFelled(!felled)}
                            value={felled}
                          />
                        </Col>
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className='mb-3'
                      controlId='formHorizontalTimeFrom'
                    >
                      {felled ? (
                        <Form.Label column sm={2}>
                          Fälldatum
                        </Form.Label>
                      ) : (
                        ''
                      )}
                      <Col sm={5}>
                        <div className='d-flex'>
                          {felled ? (
                            <>
                              <Form.Group controlId='datefrom'>
                                <Form.Control
                                  type='date'
                                  name='fellingDate'
                                  placeholder='Due date'
                                  maxLength='150px'
                                />
                              </Form.Group>
                            </>
                          ) : (
                            ''
                          )}
                        </div>
                      </Col>
                    </Form.Group>
                  </div>
                </div>

                <Col sm={8}>
                  <div className='d-flex align-items-center'>
                    <Button
                      variant='primary'
                      size='lg'
                      className='w-100'
                      type='submit'
                      disabled={loading}
                    >
                      Inserat erstellen
                    </Button>
                  </div>
                </Col>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </Layout>
  )
}

export default createAdvert
