'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  X,
  Users,
  Star,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface Dish {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  price: number;
  menu?: { _id: string; name: string };
  category: { _id: string; name: string };
  image?: any;
  allergens: string[];
  isAvailable: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Menu {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}



export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    menuId: '',
    categoryId: '',
    isAvailable: true,
    isPopular: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dishesResponse, menusResponse, categoriesResponse] = await Promise.all([
          fetch('/api/dishes'),
          fetch('/api/menus'),
          fetch('/api/categories'),
        ]);

        if (dishesResponse.ok) {
          const dishesData = await dishesResponse.json();
          setDishes(dishesData.dishes || []);
        } else {
          console.error('Failed to fetch dishes:', dishesResponse.statusText);
        }

        if (menusResponse.ok) {
          const menusData = await menusResponse.json();
          setMenus(menusData.menus || []);
        } else {
          console.error('Failed to fetch menus:', menusResponse.statusText);
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.categories || []);
        } else {
          console.error('Failed to fetch categories:', categoriesResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateOrUpdateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = modalMode === 'create' ? '/api/dishes' : `/api/dishes/${selectedDish?._id}`;
      const method = modalMode === 'create' ? 'POST' : 'PATCH';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDish,
          price: parseFloat(newDish.price),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (modalMode === 'create') {
          setDishes([...dishes, result.dish]);
        } else {
          setDishes(dishes.map((dish) => 
            dish._id === result.dish._id ? result.dish : dish
          ));
        }
        setIsModalOpen(false);
        setNewDish({
          name: '',
          description: '',
          price: '',
          menuId: '',
          categoryId: '',
          allergens: [],
          isAvailable: true,
          isPopular: false,
        });
        setSelectedDish(null);
        setModalMode('create');
      } else {
        console.error(`Failed to ${modalMode} dish`);
      }
    } catch (error) {
      console.error(`Error ${modalMode} dish:`, error);
    }
  };

  const handleEditDish = (dish: Dish) => {
    setSelectedDish(dish);
    setNewDish({
      name: dish.name,
      description: dish.description || '',
      price: dish.price.toString(),
      menuId: dish.menu?._id || '',
      categoryId: dish.category._id,
      allergens: dish.allergens,
      isAvailable: dish.isAvailable,
      isPopular: dish.isPopular,
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteDish = async (dishId: string) => {
    try {
      const response = await fetch(`/api/dishes/${dishId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDishes(dishes.filter((dish) => dish._id !== dishId));
      } else {
        console.error('Failed to delete dish');
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dish.description &&
        dish.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterAvailability === 'all' ||
      (filterAvailability === 'available' && dish.isAvailable) ||
      (filterAvailability === 'unavailable' && !dish.isAvailable);
    return matchesSearch && matchesFilter;
  });

  const getAvailabilityText = (isAvailable: boolean) => {
    return isAvailable ? 'Disponible' : 'Indisponible';
  };

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="mt-4 sm:mt-0 h-10 w-32" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16 mt-2" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Array(8).fill(0).map((_, index) => (
                  <th key={index} className="px-6 py-3">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array(3).fill(0).map((_, index) => (
                <tr key={index}>
                  {Array(8).fill(0).map((_, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm: justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Plats</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos plats et organisez-les par  catégories
          </p>
        </div>
        <button
          onClick={() => {
            setModalMode('create');
            setNewDish({
              name: '',
              description: '',
              price: '',
              menuId: '',
              categoryId: '',
              isAvailable: true,
              isPopular: false,
            });
            setIsModalOpen(true);
          }}
          className="mt-4 sm:mt-0 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Plat
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalMode === 'create' ? 'Créer un nouveau plat' : 'Modifier le plat'}
              </h2>
              <button onClick={() => {
                setIsModalOpen(false);
                setSelectedDish(null);
                setModalMode('create');
              }}>
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleCreateOrUpdateDish} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prix (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newDish.price}
                  onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Menu</label>
                <select
                  value={newDish.menuId}
                  onChange={(e) => setNewDish({ ...newDish, menuId: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Aucun menu</option>
                  {menus.map((menu) => (
                    <option key={menu._id} value={menu._id}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                <select
                  value={newDish.categoryId}
                  onChange={(e) => setNewDish({ ...newDish, categoryId: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={newDish.isAvailable}
                    onChange={(e) => setNewDish({ ...newDish, isAvailable: e.target.checked })}
                    className="mr-2"
                  />
                  Disponible
                </label>
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={newDish.isPopular}
                    onChange={(e) => setNewDish({ ...newDish, isPopular: e.target.checked })}
                    className="mr-2"
                  />
                  Plat populaire
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedDish(null);
                    setModalMode('create');
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  {modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-co sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un plat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="unavailable">Indisponible</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plats</p>
              <p className="text-2xl font-bold text-gray-900">{dishes.length}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plats Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {dishes.filter((d) => d.isAvailable).length}
              </p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plats Populaires</p>
              <p className="text-2xl font-bold text-gray-900">
                {dishes.filter((d) => d.isPopular).length}
              </p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
  <Table className="min-w-[800px]">
    <TableHeader className="bg-gray-50">
      <TableRow>
        <TableHead>Nom</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Prix (fdj)</TableHead>
        <TableHead>Catégorie</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {filteredDishes.length === 0 ? (
        <TableRow>
          <TableCell colSpan={8} className="text-center text-gray-500">
            Aucun plat trouvé
          </TableCell>
        </TableRow>
      ) : (
        filteredDishes.map((dish) => (
          <TableRow key={dish._id}>
            <TableCell className="font-medium ">
                {dish.image && (
                  <div>
                  <Image
                    src={urlFor(dish.image).url()}
                    alt={dish.name}
                    width={40}
                    height={40}
                    className="object-cover rounded mr-2 inline-block"
                    />
                    {dish.name}               
                    </div>
                )}
                </TableCell>
            <TableCell>{dish.description || "-"}</TableCell>
            <TableCell>{dish.price} </TableCell>
            <TableCell>{dish.category.name}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(
                  dish.isAvailable
                )}`}
              >
                {getAvailabilityText(dish.isAvailable)}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditDish(dish)}
                  className="text-orange-500 hover:text-orange-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer le plat</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer le plat "{dish.name}" ?
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteDish(dish._id)}>
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