import Head from 'next/head'
import Layout from '../components/Layout'
import { Col, Row } from 'react-bootstrap'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Home</title>
        <meta name='description' content='Homepage' />
        <link rel='icon' href='../logo.svg' />
      </Head>

      <Row className='mt-3'>
        <Col md={12}>
          <h1>Home</h1>
          <p>
            Diese Webseite ist das Resultat eines Schulprojekts zur Erstellung
            einer Vermarktungseite für Bäume und Hölzer. In dieser Form dienst
            sie rein akademischen Zwecken und ist nicht kommerziell.
          </p>
        </Col>
      </Row>

      <center>
        <Row className='mt-3'>
          <Col md={12}>
            <div class='row'>
              <div class='col align-self-start'>
                <h2>Inserat</h2>
                <p>Ich möchte einen Baum anbieten.</p>
              </div>
              <div class='col align-self-end'>
                <h2>Gesuch</h2>
                <p>Ich möchte einen Baum suchen.</p>
              </div>
            </div>

            <div class='row'>
              <div class='col align-self-start'>
                <h2>Meine Inserate</h2>
                <p>Ich möchte meine Auswahl an Inseraten sehen.</p>
              </div>
              <div class='col align-self-end'>
                <h2>Meine Gesuche</h2>
                <p>Ich möchte meine Auswahl an Gesuchen sehen.</p>
              </div>
            </div>
          </Col>
        </Row>
      </center>
    </Layout>
  )
}
