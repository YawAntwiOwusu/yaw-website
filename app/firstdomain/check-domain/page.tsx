import { redirect } from "next/navigation";

export const metadata = {
  title: "Check Domain Availability",
};

export default function CheckDomainPage() {
  redirect("/firstdomain#search");
}
