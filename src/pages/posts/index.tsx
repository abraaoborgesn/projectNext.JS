import Head from 'next/head'
import { createClient } from '../../services/prismic'

import styles from './styles.module.scss'


export default function Posts() {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href='#'>
                        <time>12 de março de 2021</time>
                        <strong>Creating a Monorego with Lerna & Yarn Workspaces</strong>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis blanditiis est unde iure consectetur! Molestias qui, inventore nesciunt provident eos iure quam autem labore doloribus, soluta nostrum ad necessitatibus neque.</p>
                    </a>
                    <a href='#'>
                        <time>12 de março de 2021</time>
                        <strong>Creating a Monorego with Lerna & Yarn Workspaces</strong>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis blanditiis est unde iure consectetur! Molestias qui, inventore nesciunt provident eos iure quam autem labore doloribus, soluta nostrum ad necessitatibus neque.</p>
                    </a>
                    <a href='#'>
                        <time>12 de março de 2021</time>
                        <strong>Creating a Monorego with Lerna & Yarn Workspaces</strong>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis blanditiis est unde iure consectetur! Molestias qui, inventore nesciunt provident eos iure quam autem labore doloribus, soluta nostrum ad necessitatibus neque.</p>
                    </a>
                    <a href='#'>
                        <time>12 de março de 2021</time>
                        <strong>Creating a Monorego with Lerna & Yarn Workspaces</strong>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis blanditiis est unde iure consectetur! Molestias qui, inventore nesciunt provident eos iure quam autem labore doloribus, soluta nostrum ad necessitatibus neque.</p>
                    </a>

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

    console.log(JSON.stringify(response, null, 2))

    
    return {
        props: {}, // Will be passed to the page component as props
    }
}

