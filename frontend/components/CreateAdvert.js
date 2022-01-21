import Link from 'next/link'
import React from 'react'
import { Button } from 'react-bootstrap'

const CreateAdvert = () => {
  return (
    <Link href='/createAdvert'>
      <Button variant='primary' className='w-100'>
        Jetzt Inserat erstellen
      </Button>
    </Link>
  )
}

export default CreateAdvert
