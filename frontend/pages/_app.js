import SSRProvider from 'react-bootstrap/SSRProvider'
import '@fortawesome/fontawesome-free/css/all.css'
import '../styles/styles.scss'
import { UserProvider } from '../contexts/UserContext'
import { ItemListProvider } from '../contexts/ItemListContext'
import { ChatProvider } from '../contexts/ChatContext'
import { MessageProvider } from '../contexts/MessageContext'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SSRProvider>
        <MessageProvider>
          <UserProvider>
            <ChatProvider>
              <ItemListProvider>
                <Component {...pageProps} />
              </ItemListProvider>
            </ChatProvider>
          </UserProvider>
        </MessageProvider>
      </SSRProvider>
    </>
  )
}

export default MyApp
