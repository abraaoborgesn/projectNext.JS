import { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'

import '../styles/global.scss'
import { PrismicProvider } from '@prismicio/react'
// import { linkResolver, repositoryName } from '../services/prismic'
import Link from 'next/link'
import { PrismicPreview } from '@prismicio/next'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <NextAuthProvider session={session}>
      <PrismicProvider
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>
            {children}
          </a>
        </Link>
      )}
    >
      
      <Header />
      <Component {...pageProps} />
    
        
    </PrismicProvider>
    </NextAuthProvider>
  )
}

export default MyApp
