import { redirect } from "next/navigation";

//? /writing/[slug] (singular) is a legacy path — see /writing/page.tsx.
export default async function LegacyWritingPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/writings/${slug}`);
}
