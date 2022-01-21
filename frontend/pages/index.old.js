import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Col, Row } from 'react-bootstrap'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Home</title>
          <meta name='description' content='DHBW Holzprojekt' />
          <link rel='icon' href='../logo.svg' />
          <link
            rel='stylesheet'
            href='https://unpkg.com/aos@next/dist/aos.css'
          />
          <link rel='preload' as='tree' href='../images/tree.jpg'></link>
        </Head>

        <main className={styles.main}>
          <h1
            data-aos='fade-left'
            data-aos-duration='2000'
            className={styles.title}
          >
            DHBW-Holzprojekt
          </h1>
          <h2
            data-aos='fade-right'
            data-aos-duration='1500'
            className={styles.description}
          >
            Willkommen!
          </h2>
        </main>

        <main className={styles.main}>
          <div className={styles.description}>
            <h1 className={styles.title} data-aos='zoom-in'>
              Überschrift 1
            </h1>
            <p data-aos='zoom-in' data-aos-duration='1000' data-aos-delay='500'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </main>

        <Row className='mt-3'>
          <main className={styles.main}>
            <div className={styles.description}>
              <h1 className={styles.title} data-aos='zoom-in'>
                Überschrift 1
              </h1>
              <p
                data-aos='zoom-in'
                data-aos-duration='1000'
                data-aos-delay='500'
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <figure class={styles.image}>
              <Image
                class={styles.img}
                src='/images/tree.jpg'
                height={8192}
                width={5487}
                alt='Low-angle Shot Photography of Green Trees'
                copyright='Photo by Felix Mittermeier from Pexels'
              ></Image>
              <figcaption class={styles.caption}>
                &copy; Felix Mittermeier
              </figcaption>
            </figure>
          </main>
        </Row>

        <script src='https://unpkg.com/aos@next/dist/aos.js'></script>
        <script>AOS.init();</script>
      </div>
    </Layout>
  )
}
