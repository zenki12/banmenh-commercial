// Barrel export — Firestore adapters (server context only).
export { firestoreUserRepository, ensureUser } from "./user-repository";
export {
  claimLegacyEntitlementForReport,
  firestoreEntitlementRepository,
} from "./entitlement-repository";
export {
  firestoreReportRepository,
  numerologyInputHash,
  numerologyReportId,
} from "./report-repository";
export { firestoreTarotReadingRepository } from "./tarot-reading-repository";
export {
  firestorePurchaseRepository,
  updatePurchaseProviderRef,
} from "./purchase-repository";
export { firestoreVoucherRepository } from "./voucher-repository";
