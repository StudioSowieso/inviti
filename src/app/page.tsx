import { redirect } from "next/navigation";

// De marketing-landingspagina volgt later; voor nu naar het inlogscherm.
export default function Home() {
  redirect("/inloggen");
}
