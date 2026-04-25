import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ sessionId: string }> };

export default async function ConfirmRedirectPage({ params }: PageProps) {
  const { sessionId } = await params;
  redirect(`/claim/${sessionId}`);
}
