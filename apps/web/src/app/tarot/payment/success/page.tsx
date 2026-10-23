"use client";

import { Suspense } from "react";
import { PaymentSuccess } from "../../../../components/payment/PaymentSuccess";
import { LoadingState } from "../../../../components/ui";

export default function TarotPaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingState message="Đang xác nhận gói Tarot..." />}>
      <PaymentSuccess module="tarot" />
    </Suspense>
  );
}
