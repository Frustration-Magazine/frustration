import RedirectionMessage from "@/components/redirection-message";

export default function Unauthorized() {
  return <RedirectionMessage href="/signin">Veuillez vous authentifier pour accéder à cette page</RedirectionMessage>;
}
