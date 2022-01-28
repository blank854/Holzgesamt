import Link from 'next/link'
import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap'

const Item = ({ item }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  return (
    <div className='Item rounded'>
      <Link href={`/${item._id}`}>
        <Card
          style={{ cursor: 'pointer', border: 'none' }}
          className='bg-light text-primary h-100'
          onMouseEnter={() => setDetailsVisible(true)}
          onMouseLeave={() => setDetailsVisible(false)}
        >
          {
            <Card.Img
              variant='top'
              src={item.pictures[0].access}
              className='p-3'
              style={{
                borderRadius: '1.25rem',
                objectFit: 'cover',
                height: '15rem',
              }}
            />
          }

          <Card.Body className='pt-0 h-100 d-flex flex-column'>
            <Card.Title className='item-title'>
              <h5>
                <b>{item.title}</b>
              </h5>
            </Card.Title>
            <Card.Text as='div' className='flex-grow-1'>
              <div className='attributes my-3'>
                <span className='bg-secondary py-1 px-2 rounded me-2 text-nowrap d-inline-block mb-2'>
                  {item.treeDetail.species.german}
                </span>
                <span className='bg-secondary py-1 px-2 rounded me-2 text-nowrap d-inline-block  mb-2'>
                  {item.treeDetail.species.latin}
                </span>
                <span className='bg-secondary py-1 px-2 rounded me-2 text-nowrap d-inline-block mb-2'>
                  {item.price.priceType}
                </span>
              </div>
            </Card.Text>
            <div className='footer d-flex justify-content-between'>
              <h5>
                <b>{`${item.price.priceValue}€`}</b>
              </h5>
              <Button
                variant='primary'
                size='sm'
                className={`${detailsVisible ? '' : 'hidden'}`}
              >
                Details
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Link>
    </div>
  )
}

export default Item
