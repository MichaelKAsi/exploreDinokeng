import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, Banner } from '../lib/supabase';
import { LogOut, Plus, Trash2, AlertCircle, Check } from 'lucide-react';

export function AdminDashboard() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    button_text: '',
    background_image: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/admin/login');
      return;
    }
    fetchBanners();
  }, [session, navigate]);

  const fetchBanners = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('banners')
        .select('*')
        .order('order', { ascending: true });

      if (fetchError) throw fetchError;
      setBanners(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch banners');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from('banners')
          .update({
            title: formData.title,
            button_text: formData.button_text || null,
            background_image: formData.background_image,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (updateError) throw updateError;
        setSuccess('Banner updated successfully');
      } else {
        const { error: insertError } = await supabase
          .from('banners')
          .insert([
            {
              title: formData.title,
              button_text: formData.button_text || null,
              background_image: formData.background_image,
              order: banners.length,
            },
          ]);

        if (insertError) throw insertError;
        setSuccess('Banner created successfully');
      }

      setFormData({ title: '', button_text: '', background_image: '' });
      setEditingId(null);
      fetchBanners();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setFormData({
      title: banner.title,
      button_text: banner.button_text || '',
      background_image: banner.background_image,
    });
    setEditingId(banner.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setSuccess('Banner deleted successfully');
      fetchBanners();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete banner');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleCancel = () => {
    setFormData({ title: '', button_text: '', background_image: '' });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif text-slate-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
            <Check className="w-5 h-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {editingId ? 'Edit Banner' : 'Add Banner'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Banner title"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) =>
                      setFormData({ ...formData, button_text: e.target.value })
                    }
                    placeholder="e.g., Learn More (optional)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Background Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.background_image}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        background_image: e.target.value,
                      })
                    }
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {editingId ? 'Update' : 'Create'}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold py-2 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Banners
              </h2>

              {banners.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No banners yet. Create your first banner!
                </p>
              ) : (
                <div className="space-y-4">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-lg mb-1">
                            {banner.title}
                          </h3>
                          {banner.button_text && (
                            <p className="text-sm text-slate-600 mb-2">
                              Button: {banner.button_text}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 truncate">
                            {banner.background_image}
                          </p>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(banner)}
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
