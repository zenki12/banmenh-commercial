"use client";

import { PaymentCancel } from "../../../../components/payment/PaymentCancel";

export default function TarotPaymentCancelPage() {
  return <PaymentCancel retryUrl="/tarot/payment" homeUrl="/tarot" />;
}
