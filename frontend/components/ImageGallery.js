import React, { useState } from 'react'
import { Carousel, Col, Row } from 'react-bootstrap'

const ImageGallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0)

  const handleSelect = (index) => {
    setActiveImage(index)
  }

  return (
    <>
      <Carousel
        activeIndex={activeImage}
        onSelect={handleSelect}
        interval={null}
      >
        {images.map((image, index) => (
          <Carousel.Item key={index} className='rounded'>
            <img
              className='d-block w-100 rounded'
              src={image.access}
              alt='Bilder des Inserats'
              style={{ objectFit: 'scale-down', height: '350px' }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
      <div className='mt-3'>
        {images.map((image, index) => (
          <img
            className={`rounded me-2 mb-2 pointer d-inline-block w-auto ${
              index === activeImage ? 'border border-primary' : ''
            }`}
            src={image.access}
            alt='Bilder des Inserats'
            style={{ objectFit: 'contain', maxHeight: '70px' }}
            onClick={() => handleSelect(index)}
            key={index}
          />
        ))}
      </div>
    </>
  )
}

export default ImageGallery
