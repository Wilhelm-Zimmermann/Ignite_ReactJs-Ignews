import { signIn, useSession } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const [session] = useSession();

    const handleSubscribe = async () => {

        if(!session) {
            signIn("github");
            return;
        }

        try {
            const res = await api.post("/subscribe");

            const { sessionId } = res.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({sessionId});
        }catch (err){
            alert(err);
        }
    }

    return (
        <button onClick={handleSubscribe} className={styles.subscribeButton}>
            Subscribe now
        </button>
    );
}