import { redirect } from "next/navigation";

type LegacyEditDeckPageProps = {
  params: Promise<{ deckId: string }>;
};

export default async function LegacyEditDeckPage({
  params,
}: LegacyEditDeckPageProps) {
  const { deckId } = await params;

  redirect(`/dashboard/preferences/decks/${deckId}`);
}
