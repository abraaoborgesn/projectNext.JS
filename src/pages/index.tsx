import { GetStaticProps } from 'next'
import Head from 'next/head'

import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'

// EXPLICAÇÃO PARA AS CHAMADAS À API NO NEXT.JS
// 3 formas de fazer chamada à API
// Client-side Rendering ( não faz indexação para motores de busca (Ex.: google))
// Server-side Rendering ( mais custoso )
// Static Site Generation ( salva informações dos site que não vão precisar ser mudadas durante um bom tempo )


// ********  EXEMPLO: Post do blog  **************

// Conteúdo (SSG) --> precisa indexar para os motores de busca 
// Comentários (Client-side) --> poderia ser SSR, porém não precisa dos comentário assim que a página é exibida em tela, precisa dos comentários só depois da página ter carregado




interface HomeProps {
  product: {
    priceId: string,
    amount: number
  }
}

export default function Home({ product }: HomeProps) {

  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>

          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1Kbx04Jjbo3sRdLsxHtXrJiV', {
    expand: ['product']  // para ter acesso a todas as informações do produto
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hrs
  }
}
