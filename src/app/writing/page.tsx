import { redirect } from "next/navigation";

//? /writing (singular) is a legacy path — the real route is /writings
//? (plural), matching the canonical_url convention used across every
//? synapse post. Redirect rather than 404 in case anything already links here.
export default function LegacyWritingIndex() {
  redirect("/writings");
}
