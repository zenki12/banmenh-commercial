"use client";

import { Suspense } from "react";
import { PaymentSetup } from "../../../components/payment/PaymentSetup";
import { LoadingState } from "../../../components/ui";

export default function TarotPaymentPage() {
  return (
    <Suspense fallback={<LoadingState message="Đang tải thông tin gói Tarot..." />}>
      <PaymentSetup productCode="tarot_guide_monthly" />
    </Suspense>
  );
}
