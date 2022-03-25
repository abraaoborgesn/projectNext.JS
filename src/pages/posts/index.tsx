import Head from 'next/head'
import { createClient } from '../../services/prismic'
import { RichText } from 'prismic-dom'

import styles from './styles.module.scss'

type Post = {
    slug: string,
    title: string,
    excerpt: string,
    updatedAt: string
}

interface PostsProps {
    posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <a key={post.slug} href='#'>
                            <time>{post.updatedAt}</time>
                            <strong>{post.title}</strong>
                            <p>{post.excerpt}</p>
                        </a>
                    ))}



                </div>
            </main>
        </>
    )
}


export async function getStaticProps({ previewData }) {
    const client = createClient({ previewData })

    const response = await client.getAllByType('post', {
        pageSize: 100
    })

    // console.log(response)
    console.log(JSON.stringify(response, null, 2))

    const posts = response.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === "paragraph")?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })


    return {
        props: { posts }, // Will be passed to the page component as props
    }
}

