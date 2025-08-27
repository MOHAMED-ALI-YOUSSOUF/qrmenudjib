'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Star } from 'lucide-react';
import {
  Button,
} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  createdAt: string;
  updatedAt: string;
  dishCount?: number;
  image?: string;
  isActive: boolean;
  order: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = modalMode === 'create' ? '/api/categories' : `/api/categories/${selectedCategory?._id}`;
      const method = modalMode === 'create' ? 'POST' : 'PATCH';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const result = await response.json();
        if (modalMode === 'create') {
          setCategories([...categories, result.category]);
        } else {
          setCategories(categories.map((c) => c._id === result.category._id ? result.category : c));
        }
        setOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur sauvegarde catégorie:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setForm({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive,
      order: category.order || 0,
    });
    setModalMode('edit');
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) setCategories(categories.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Erreur suppression catégorie:', error);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', image: '', isActive: true, order: 0 });
    setSelectedCategory(null);
    setModalMode('create');
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a,b) => a.order - b.order);
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes Catégories</h1>
          <p className="text-gray-600">Gérez vos catégories pour organiser vos plats</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setModalMode('create');
              }}
              className="mt-4 sm:mt-0 bg-orange-500 text-white hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" /> Nouvelle Catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{modalMode === 'create' ? 'Créer une catégorie' : 'Modifier la catégorie'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label>Nom</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Image</Label>
                {form.image ? (
                  <div className="flex flex-col items-start gap-2">
                    <Image
                      src={urlFor(form.image).url() || form.image}
                      alt="Preview"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded object-cover border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({ ...form, image: "" })}
                    >
                      Changer l’image
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
                    <span className="text-sm text-gray-500">Uploader une image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append("file", file);

                        try {
                          const res = await fetch("/api/upload-image", {
                            method: "POST",
                            body: formData,
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setForm({ ...form, image: data.url }); // URL utilisable dans <Image />
                          }
                        } catch (err) {
                          console.error("Erreur upload image:", err);
                        }
                      }}
                    />
                  </label>
                )}
              </div>


              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
              </div>
              <div>
                <Label>Ordre d'affichage</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
                  {modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Total Catégories</p>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Total Plats</p>
          <p className="text-2xl font-bold">
            {categories.reduce((sum, c) => sum + (Number(c.dishCount) || 0), 0)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Plats</TableHead>
              <TableHead>Actif</TableHead>            
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Aucune catégorie trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((c) => (
                <TableRow key={c._id}>
                  <TableCell className='flex items-center gap-2'>
                    <span className="font-medium">{c.order}</span> -    {c.image ? (
                      <Image 
                      src={urlFor(c.image).url() || c.image} 
                      alt={c.name}
                      width={40}
                      height={40}
                       className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center text-white text-4xl" >
                    🍽️
                  </div>
                  
                    )
                  }{c.name}</TableCell>
                  <TableCell>{c.description || '-'}</TableCell>
                  
                  <TableCell>{c.dishCount ? c.dishCount : '0'}</TableCell>
                  <TableCell>{c.isActive ? '✅' : '❌'}</TableCell>
                 
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(c)}
                        className="text-orange-500"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer {c.name} ?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(c._id)}>
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
