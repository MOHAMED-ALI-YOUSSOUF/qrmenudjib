'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  QrCode,
  Calendar,
  Users,
  Star,
  ExternalLink,
  X,
} from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { FiltersSkeleton, MenusTableSkeleton, StatsSkeleton } from '@/components/dashboard/skeletons';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Menu {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  image?: any;
  category?: { name: string };
  dishCount: number;
  views?: number;
}

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [newMenu, setNewMenu] = useState({
    name: '',
    description: '',
    status: 'draft',
    categoryId: '',
  });
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        } else {
          console.error('Failed to fetch categories:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus');
        if (response.ok) {
          const data = await response.json();
          setMenus(data.menus || []);
        } else {
          console.error('Failed to fetch menus:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching menus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleCreateOrUpdateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = modalMode === 'create' ? '/api/menus' : `/api/menus/${selectedMenu?._id}`;
      const method = modalMode === 'create' ? 'POST' : 'PATCH';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMenu),
      });

      if (response.ok) {
        const result = await response.json();
        if (modalMode === 'create') {
          setMenus([...menus, result.menu]);
        } else {
          setMenus(menus.map((menu) => 
            menu._id === result.menu._id ? result.menu : menu
          ));
        }
        setIsModalOpen(false);
        setNewMenu({ name: '', description: '', status: 'draft', categoryId: '' });
        setSelectedMenu(null);
        setModalMode('create');
      } else {
        console.error(`Failed to ${modalMode} menu`);
      }
    } catch (error) {
      console.error(`Error ${modalMode} menu:`, error);
    }
  };

  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setNewMenu({
      name: menu.name,
      description: menu.description || '',
      status: menu.status,
      categoryId: menu.category?._id || '',
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteMenu = async (menuId: string) => {
    try {
      const response = await fetch(`/api/menus/${menuId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenus(menus.filter((menu) => menu._id !== menuId));
      } else {
        console.error('Failed to delete menu');
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  const filteredMenus = menus.filter((menu) => {
    const matchesSearch =
      menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (menu.description &&
        menu.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || menu.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'draft':
        return 'Brouillon';
      case 'archived':
        return 'Archivé';
      default:
        return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-6 w-40" />
            <div className="mt-2"><Skeleton className="h-4 w-64" /></div>
          </div>
          <Skeleton className="h-10 w-40 mt-4 sm:mt-0" />
        </div>

        {/* Filtres */}
        <FiltersSkeleton />

        {/* Stats */}
        <StatsSkeleton />

        {/* Tableau */}
        <MenusTableSkeleton />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Menus</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos menus et organisez vos plats par catégories
          </p>
        </div>
        <button
          onClick={() => {
            setModalMode('create');
            setNewMenu({ name: '', description: '', status: 'draft', categoryId: '' });
            setIsModalOpen(true);
          }}
          className="mt-4 sm:mt-0 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Menu
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalMode === 'create' ? 'Créer un nouveau menu' : 'Modifier le menu'}
              </h2>
              <button onClick={() => {
                setIsModalOpen(false);
                setSelectedMenu(null);
                setModalMode('create');
              }}>
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleCreateOrUpdateMenu} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={newMenu.name}
                  onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newMenu.description}
                  onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <select
                  value={newMenu.status}
                  onChange={(e) => setNewMenu({ ...newMenu, status: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="draft">Brouillon</option>
                  <option value="active">Actif</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                <select
                  value={newMenu.categoryId}
                  onChange={(e) => setNewMenu({ ...newMenu, categoryId: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Aucune catégorie</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedMenu(null);
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Menus</p>
              <p className="text-2xl font-bold text-gray-900">{menus.length}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Menus Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {menus.filter((m) => m.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-600">Vues Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {menus.reduce((sum, menu) => sum + (Number(menu.views) || 0), 0)}
              </p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Menus Table */}
     <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Plats</TableHead>
              <TableHead>Vues</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMenus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Aucun menu trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredMenus.map((menu) => (
                <TableRow key={menu._id}>
                  <TableCell className="font-medium">{menu.name}</TableCell>
                  <TableCell>{menu.description || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        menu.status
                      )}`}
                    >
                      {getStatusText(menu.status)}
                    </span>
                  </TableCell>
                  <TableCell>{menu.category?.name || "-"}</TableCell>
                  <TableCell>{menu.dishCount}</TableCell>
                  <TableCell>{menu.views ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditMenu(menu)}
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
                            <AlertDialogTitle>Supprimer le menu</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer le menu "{menu.name}" ?
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteMenu(menu._id)}>
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