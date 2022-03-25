import { loadStripe } from '@stripe/stripe-js'

export async function getStripeJs() {
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) /// passa a chave pública do stripe. (Olhar no site)

    return stripeJs
}