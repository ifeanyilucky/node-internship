let stripe;
let publishableKey;

async function fetchPublishableKey() {
  try {
    const response = await fetch('/config');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    publishableKey = data.publishableKey;
    stripe = Stripe(publishableKey);
  } catch (error) {
    console.error('Error fetching publishable key:', error);
  }
}

async function initStripeCheckout(productId) {
  if (!stripe) {
    await fetchPublishableKey();
  }

  if (!stripe) {
    console.error('Stripe has not been initialized');
    return;
  }

  try {
    const response = await fetch(`/create-checkout-session/${productId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      console.error(result.error.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Fetch the publishable key when the script loads
fetchPublishableKey();
