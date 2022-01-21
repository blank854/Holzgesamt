import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import { Col, Row } from 'react-bootstrap'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>AGBs</title>
        <meta name='description' content='Allgemeine Geschäftsbedingungen' />
        <link rel='icon' href='../logo.svg' />
      </Head>

      <Row className='mt-3'>
        <Col md={12}>
          <h1>AGBs</h1>
          <p>..</p>
          <div>
            <ol>
              <li>Überschrift 1</li>
              <ol>
                <li>Überschrift 1.1</li>
                <p>Das ist ein Test.</p>
                <li>Überschrift 1.2</li>
                <p>Das ist ein Test.</p>
              </ol>
              <li>Überschrift 2</li>
              <li>Überschrift 3</li>
            </ol>
          </div>
        </Col>
      </Row>
    </Layout>
  )
}
