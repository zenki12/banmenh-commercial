import type { Metadata } from "next";
import { ModulePageShell } from "../../components/layout";
import { TarotExperience } from "../../modules/tarot/TarotExperience";

export const metadata: Metadata = {
  title: "Tarot",
};

export default function TarotPage() {
  return (
    <ModulePageShell>
      <TarotExperience />
    </ModulePageShell>
  );
}
