import { useSession, signIn } from 'next-auth/react'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    // 1º Saber se o usuário está logado, para poder fazer o subScribe do mesmo
    const { data: session } = useSession()

    async function handleSubscribe() {
        if (!session) {
            signIn('github')
            return
        }

        try {
            const response = await api.post('/subscribe')
            // console.log(response.data)
            
            const { sessionId } = response.data

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({ sessionId: sessionId })
        } catch (err) {
            alert(err.message)
        }


    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}