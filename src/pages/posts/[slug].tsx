import { createClient } from "../../services/prismic"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { RichText } from "prismic-dom"
import Head from "next/head"

import styles from './post.module.scss'

interface PostProps {
    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string
    }
}

export default function Post({ post }: PostProps) {
    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params, previewData }) => {
    const session = await getSession({ req }) // verificar se o usuário está logado ou não
    const { slug } = params

    // console.log(session)
    
    if(!session?.activeSubscription) {  // se o usuário não tiver uma subscription ativa...
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
            
        }
    }

    const prismic = createClient({ previewData })

    const response = await prismic.getByUID('post', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post,
        }
    }

}

