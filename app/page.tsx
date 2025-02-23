import { redirect } from "next/navigation";

export default function Home() {
  // Redirect the home page to the tarot reading page.
  redirect("/tarot");
}
