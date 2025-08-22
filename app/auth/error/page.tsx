import { Button } from "@/components/ui/button";
import Link from "next/link";

// app/auth/error/page.tsx - Optionnel, pour errors auth
export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Erreur d'authentification</h1>
        <p className="text-gray-600">Une erreur est survenue. Veuillez réessayer.</p>
        <Link href="/auth/signin">
          <Button className="mt-4">Retour à la connexion</Button>
        </Link>
      </div>
    </div>
  );
}