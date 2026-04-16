'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { theatresApi } from '@/lib/api';
import { Building2, Loader2, MapPin, Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const initialFormState = {
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  amenities: '',
};

export default function AdminTheatresPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      router.push('/dashboard');
    } else if (isLoaded) {
      fetchTheatres();
    }
  }, [user, isLoaded, router]);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await theatresApi.getAll();
      setTheatres(response.data.data || []);
    } catch (error) {
      console.error('Error fetching theatres:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to load theatres');
      setTheatres([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsFormOpen(true);
  };

  const openEditForm = (theatre) => {
    setEditingId(theatre._id);
    setFormData({
      name: theatre.name || '',
      address: theatre.location?.address || '',
      city: theatre.location?.city || '',
      state: theatre.location?.state || '',
      zipCode: theatre.location?.zipCode || '',
      amenities: theatre.amenities?.join(', ') || '',
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim() || !formData.city.trim()) {
      alert('Name, address, and city are required');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      location: {
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
      },
      amenities: formData.amenities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);
      setErrorMessage('');

      if (editingId) {
        await theatresApi.update(editingId, payload);
      } else {
        await theatresApi.create(payload);
      }

      closeForm();
      await fetchTheatres();
    } catch (error) {
      console.error('Error saving theatre:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to save theatre');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this theatre?')) return;

    try {
      setErrorMessage('');
      await theatresApi.delete(id);
      await fetchTheatres();
    } catch (error) {
      console.error('Error deleting theatre:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to delete theatre');
    }
  };

  if (!isLoaded || user?.publicMetadata?.role !== 'admin') {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center text-white">
        <Loader2 className="h-12 w-12 animate-spin text-red-300" />
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="glass-panel rounded-2xl px-6 py-5">
            <h1 className="text-4xl font-bold theme-gradient-text">
              Manage Theatres
            </h1>
            <p className="mt-2 text-zinc-300">Create and update theatre details used in showtime scheduling.</p>
          </div>

          <button
            onClick={openCreateForm}
            className="cta-primary inline-flex items-center gap-2 px-5 py-3"
          >
            <Plus className="h-5 w-5" />
            Add Theatre
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {errorMessage}
          </div>
        )}

        {isFormOpen && (
          <div className="glass-panel mb-8 rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? 'Edit Theatre' : 'Add Theatre'}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Theatre name"
                className="input-glass"
                required
              />
              <input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
                className="input-glass"
                required
              />
              <input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="input-glass"
                required
              />
              <input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                className="input-glass"
              />
              <input
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="Zip code"
                className="input-glass"
              />
              <input
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="Amenities (comma separated)"
                className="input-glass"
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="cta-primary inline-flex items-center gap-2 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {saving ? 'Saving...' : editingId ? 'Update Theatre' : 'Create Theatre'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-red-500" />
          </div>
        ) : theatres.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/10 p-12 text-center backdrop-blur-xl">
            <Building2 className="mx-auto mb-4 h-14 w-14 text-red-300" />
            <p className="text-lg text-zinc-200">No theatres found</p>
            <p className="mt-2 text-zinc-400">Create your first theatre to start adding showtimes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {theatres.map((theatre) => (
              <article
                key={theatre._id}
                className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-lg backdrop-blur-xl"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-white">{theatre.name}</h3>
                  <span className="rounded-full border border-red-300/30 bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-200">
                    {theatre.screens?.length || 0} screens
                  </span>
                </div>

                <div className="mb-4 space-y-2 text-sm text-gray-300">
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                    <span>
                      {theatre.location?.address || 'N/A'}
                      <br />
                      {theatre.location?.city || 'N/A'}
                      {theatre.location?.state ? `, ${theatre.location.state}` : ''}
                      {theatre.location?.zipCode ? ` - ${theatre.location.zipCode}` : ''}
                    </span>
                  </p>
                </div>

                <p className="mb-5 text-xs text-gray-400">
                  Amenities: {theatre.amenities?.length ? theatre.amenities.join(', ') : 'Not specified'}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(theatre)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-300/35 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(theatre._id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-300/35 bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/25"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
