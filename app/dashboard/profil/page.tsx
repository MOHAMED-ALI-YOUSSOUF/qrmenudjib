"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/user/${session.user.id}`);
        const data = await res.json();

        if (res.ok && data) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            oldPassword: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          toast.error(data.error || "Impossible de charger vos infos.");
        }
      } catch (err) {
        toast.error("Erreur lors de la récupération des infos.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de la mise à jour.");
      } else {
        toast.success("Compte mis à jour !");
        if (formData.password) {
          signOut({ callbackUrl: "/auth/signin" });
        }
      }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de la suppression.");
      } else {
        toast.success("Compte supprimé.");
        signOut({ callbackUrl: "/auth/signin" });
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
        Gérer mon compte
      </h1>
      <Card className="max-w-md mx-auto border-orange-400">
        <CardHeader>
          <CardTitle className="text-orange-600">Modifier mes infos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="border-orange-400"
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
                className="border-orange-400"
              />
            </div>
            <div>
              <Label htmlFor="oldPassword">Ancien mot de passe</Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleChange}
                className="border-orange-400"
              />
            </div>
            <div>
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="border-orange-400"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmer mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border-orange-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>

          <div className="mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Supprimer mon compte
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Votre compte et toutes vos
                    données seront supprimés.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Suppression..." : "Supprimer"}
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
