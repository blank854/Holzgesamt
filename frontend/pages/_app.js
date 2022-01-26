import SSRProvider from 'react-bootstrap/SSRProvider'
import '@fortawesome/fontawesome-free/css/all.css'
import '../styles/styles.scss'
import { UserProvider } from '../contexts/UserContext'
import { ItemListProvider } from '../contexts/ItemListContext'
import { ChatProvider } from '../contexts/ChatContext'
import { MessageProvider } from '../contexts/MessageContext'
import { FilterProvider } from '../contexts/FilterContext'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <SSRProvider>
        <MessageProvider>
          <UserProvider>
            <ChatProvider>
              <ItemListProvider>
                <FilterProvider>
                  <Component {...pageProps} />
                </FilterProvider>
              </ItemListProvider>
            </ChatProvider>
          </UserProvider>
        </MessageProvider>
      </SSRProvider>
    </>
  )
}

export default MyApp
