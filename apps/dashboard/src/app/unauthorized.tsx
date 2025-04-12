import RedirectionMessage from "@/components/redirection-message";

export default function Unauthorized() {
  return (
    <RedirectionMessage href="/auth/signin">Veuillez vous authentifier pour accéder à cette page</RedirectionMessage>
  );
}
