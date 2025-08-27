"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    sellerName: "",
    email: "",
    oldPassword: "", // Nouveau champ pour l'ancien mot de passe
    password: "", // Nouveau champ pour le mot de passe
    confirmPassword: "", // Nouveau champ pour la confirmation
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordMatchError, setPasswordMatchError] = useState<string>("");
  const [oldPasswordError, setOldPasswordError] = useState<string>("");
  const [oldPasswordIncorrectError, setOldPasswordIncorrectError] = useState<string>(""); // Erreur ancien mot de passe

  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/seller/${session.user.id}`);
        const userData = await response.json();

        if (userData) {
          setFormData({
            sellerName: userData.sellerName || "",
            email: userData.email || "",
            oldPassword: "", // Ne pré-remplir pas le mot de passe
            password: "",
            confirmPassword: "",
          });
        }
      } catch (err) {
        toast.error("Erreur lors de la récupération des informations du compte.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Réinitialiser les erreurs
    setOldPasswordError("");
    setOldPasswordIncorrectError("");
    setPasswordMatchError("");
    setPasswordError("");

    if (!formData.oldPassword) {
      toast.error("Veuillez saisir votre ancien mot de passe.");
      setOldPasswordError("Veuillez saisir votre ancien mot de passe.");
      setIsSubmitting(false);
      return;
    }

    // Vérifier que les mots de passe correspondent
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      setPasswordMatchError("Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    // Valider la force du mot de passe (optionnel)
    if (formData.password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        toast.error(
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre."
        );
        setPasswordError("Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");
        setIsSubmitting(false);
        return;
      } else {
        setPasswordError(""); // Réinitialiser l'erreur
      }
    }

    try {
      const response = await fetch("/api/seller/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerName: formData.sellerName,
          email: formData.email,
          oldPassword: formData.oldPassword,
          password: formData.password || undefined, // On n'envoie le mot de passe que s'il est rempli
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Ancien mot de passe incorrect.") {
            toast.error(data.error);
          setOldPasswordIncorrectError("L'ancien mot de passe est incorrect.");
        } else {
          throw new Error(data.error || "Erreur lors de la mise à jour.");
        }
      } else {
        toast.success("Compte mis à jour avec succès !");
        // Si le mot de passe a été changé, on déconnecte l'utilisateur pour qu'il se reconnecte avec le nouveau mot de passe
        if (formData.password) {
          signOut({ callbackUrl: "/auth/signin" });
        }
      }
    } catch (err) {
      console.error("Erreur détaillée:", err);
      toast.error("Erreur lors de la mise à jour du compte.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const response = await fetch("/api/seller/delete", {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression.");
      }

      toast.success("Compte supprimé avec succès.");
      signOut({ callbackUrl: "/auth/signin" });
    } catch (err) {
      toast.error("Erreur lors de la suppression du compte.");
      setDeleteLoading(false);
      console.error(err);
    }
  };

  if (status === "loading" || loading) return <LoadingSpinner message="Chargement du compte..." />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Gérer mon compte</h1>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Modifier les informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sellerName">Nom du vendeur</Label>
              <Input
                id="sellerName"
                name="sellerName"
                type="text"
                value={formData.sellerName}
                onChange={handleChange}
                placeholder="Votre nom"
                className="dark:border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Votre email"
                className="dark:border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="oldPassword">Ancien mot de passe (requis si vous changez le mot de passe)</Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Entrez votre ancien mot de passe"
                className="dark:border-gray-600"
              />
              {oldPasswordError && <p className="text-destructive text-sm mt-1">{oldPasswordError}</p>}
              {oldPasswordIncorrectError && <p className="text-destructive text-sm mt-1">{oldPasswordIncorrectError}</p>} {/* Affichage de l'erreur */}
            </div>
            <div>
              <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez un nouveau mot de passe"
                className="dark:border-gray-600"
              />
              {passwordError && <p className="text-destructive text-sm mt-1">{passwordError}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez le mot de passe"
                className="dark:border-gray-600"
              />
              {passwordMatchError && <p className="text-destructive text-sm mt-1">{passwordMatchError}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour"}
            </Button>
          </form>
          <div className="mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Supprimer mon compte
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Votre compte et toutes les données associées (boutique, produits, commandes) seront supprimées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} disabled={deleteLoading}>
                    {deleteLoading ? "Suppression en cours..." : "Supprimer"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
