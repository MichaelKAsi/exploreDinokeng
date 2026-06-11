import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, Banner, ExperienceCard, AdditionalLink } from '../lib/supabase';
import { LogOut, Plus, Trash2, AlertCircle, Check, Upload, X as XIcon, Layers, LayoutGrid, GripVertical, Link, Eye, EyeOff } from 'lucide-react';

const ICON_OPTIONS = [
  'Mountain', 'ShoppingBag', 'Map', 'UtensilsCrossed', 'Sparkles', 'Bike', 'Heart', 'Flame', 'Coffee', 'TreePine', 'Tent', 'Compass'
];

const ICON_COLOR_OPTIONS = [
  'emerald-600', 'rose-600', 'amber-600', 'blue-600', 'purple-600', 'orange-600', 'teal-600', 'slate-600'
];

const BUTTON_ACTION_OPTIONS = [
  { value: 'link', label: 'Link (Opens URL)' },
  { value: 'modal', label: 'Modal Popup' },
  { value: 'fullscreen', label: 'Fullscreen Image' },
  { value: 'disabled', label: 'Disabled (Coming Soon)' },
];

const MODAL_TYPE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'firewood', label: 'Firewood Order' },
  { value: 'date_night', label: 'Date Night Package' },
  { value: 'picnic', label: 'Picnic Packages' },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'banners' | 'cards'>('banners');
  const [banners, setBanners] = useState<Banner[]>([]);
  const [cards, setCards] = useState<ExperienceCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Banner form state
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    button_text: '',
    background_image: '',
  });
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string>('');
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // Card form state
  const [cardFormData, setCardFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    icon: 'Mountain',
    icon_color: 'emerald-600',
    button_text: '',
    button_url: '',
    button_action: 'link',
    modal_type: '',
    is_featured: false,
    featured_badge_text: 'Featured',
    featured_gradient_from: 'rose-600',
    featured_gradient_to: 'pink-600',
    is_coming_soon: false,
    additional_links: [] as AdditionalLink[],
  });
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardPreviewUrl, setCardPreviewUrl] = useState<string>('');
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const [newLinkText, setNewLinkText] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);

  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/admin/login');
      return;
    }
    fetchBanners();
    fetchCards();
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

  const fetchCards = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('experience_cards')
        .select('*')
        .order('order', { ascending: true });

      if (fetchError) throw fetchError;
      setCards(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    }
  };

  // Banner handlers
  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (editingBannerId) {
        const { error: updateError } = await supabase
          .from('banners')
          .update({
            title: bannerFormData.title || null,
            button_text: bannerFormData.button_text || null,
            background_image: bannerFormData.background_image,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingBannerId);

        if (updateError) throw updateError;
        setSuccess('Banner updated successfully');
      } else {
        const { error: insertError } = await supabase
          .from('banners')
          .insert([
            {
              title: bannerFormData.title || null,
              button_text: bannerFormData.button_text || null,
              background_image: bannerFormData.background_image,
              order: banners.length,
            },
          ]);

        if (insertError) throw insertError;
        setSuccess('Banner created successfully');
      }

      setBannerFormData({ title: '', button_text: '', background_image: '' });
      setEditingBannerId(null);
      setBannerPreviewUrl('');
      fetchBanners();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setBannerFormData({
      title: banner.title || '',
      button_text: banner.button_text || '',
      background_image: banner.background_image,
    });
    setBannerPreviewUrl(banner.background_image);
    setEditingBannerId(banner.id);
  };

  const handleDeleteBanner = async (id: string) => {
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

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('banners').getPublicUrl(fileName);

      setBannerFormData({ ...bannerFormData, background_image: publicUrl });
      setBannerPreviewUrl(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Card handlers
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const cardData = {
        title: cardFormData.title,
        description: cardFormData.description || null,
        image_url: cardFormData.image_url,
        icon: cardFormData.icon,
        icon_color: cardFormData.icon_color,
        button_text: cardFormData.button_text || null,
        button_url: cardFormData.button_url || null,
        button_action: cardFormData.button_action,
        modal_type: cardFormData.modal_type || null,
        is_featured: cardFormData.is_featured,
        featured_badge_text: cardFormData.is_featured ? cardFormData.featured_badge_text : null,
        featured_gradient_from: cardFormData.is_featured ? cardFormData.featured_gradient_from : null,
        featured_gradient_to: cardFormData.is_featured ? cardFormData.featured_gradient_to : null,
        is_coming_soon: cardFormData.is_coming_soon,
        additional_links: cardFormData.additional_links.length > 0 ? cardFormData.additional_links : null,
      };

      if (editingCardId) {
        const { error: updateError } = await supabase
          .from('experience_cards')
          .update({
            ...cardData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCardId);

        if (updateError) throw updateError;
        setSuccess('Card updated successfully');
      } else {
        const { error: insertError } = await supabase
          .from('experience_cards')
          .insert([
            {
              ...cardData,
              order: cards.length,
            },
          ]);

        if (insertError) throw insertError;
        setSuccess('Card created successfully');
      }

      resetCardForm();
      fetchCards();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save card');
    } finally {
      setLoading(false);
    }
  };

  const resetCardForm = () => {
    setCardFormData({
      title: '',
      description: '',
      image_url: '',
      icon: 'Mountain',
      icon_color: 'emerald-600',
      button_text: '',
      button_url: '',
      button_action: 'link',
      modal_type: '',
      is_featured: false,
      featured_badge_text: 'Featured',
      featured_gradient_from: 'rose-600',
      featured_gradient_to: 'pink-600',
      is_coming_soon: false,
      additional_links: [],
    });
    setEditingCardId(null);
    setCardPreviewUrl('');
    setNewLinkText('');
    setNewLinkUrl('');
  };

  const handleEditCard = (card: ExperienceCard) => {
    setCardFormData({
      title: card.title,
      description: card.description || '',
      image_url: card.image_url,
      icon: card.icon,
      icon_color: card.icon_color,
      button_text: card.button_text || '',
      button_url: card.button_url || '',
      button_action: card.button_action,
      modal_type: card.modal_type || '',
      is_featured: card.is_featured,
      featured_badge_text: card.featured_badge_text || 'Featured',
      featured_gradient_from: card.featured_gradient_from || 'rose-600',
      featured_gradient_to: card.featured_gradient_to || 'pink-600',
      is_coming_soon: card.is_coming_soon,
      additional_links: card.additional_links || [],
    });
    setCardPreviewUrl(card.image_url);
    setEditingCardId(card.id);
  };

  const handleDeleteCard = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('experience_cards')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setSuccess('Card deleted successfully');
      fetchCards();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete card');
    }
  };

  const handleToggleCardActive = async (id: string, currentActive: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('experience_cards')
        .update({ is_active: !currentActive, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;
      setSuccess(`Card ${!currentActive ? 'activated' : 'deactivated'} successfully`);
      fetchCards();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card');
    }
  };

  const handleCardImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('experience_cards')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('experience_cards').getPublicUrl(fileName);

      setCardFormData({ ...cardFormData, image_url: publicUrl });
      setCardPreviewUrl(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddLink = () => {
    if (newLinkText && newLinkUrl) {
      setCardFormData({
        ...cardFormData,
        additional_links: [...cardFormData.additional_links, { text: newLinkText, url: newLinkUrl }],
      });
      setNewLinkText('');
      setNewLinkUrl('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setCardFormData({
      ...cardFormData,
      additional_links: cardFormData.additional_links.filter((_, i) => i !== index),
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
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

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'banners'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-5 h-5" />
            Pop-up Banners
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'cards'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Experience Cards
          </button>
        </div>

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  {editingBannerId ? 'Edit Banner' : 'Add Banner'}
                </h2>

                <form onSubmit={handleBannerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={bannerFormData.title}
                      onChange={(e) =>
                        setBannerFormData({ ...bannerFormData, title: e.target.value })
                      }
                      placeholder="Banner title (optional)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={bannerFormData.button_text}
                      onChange={(e) =>
                        setBannerFormData({ ...bannerFormData, button_text: e.target.value })
                      }
                      placeholder="e.g., Learn More (optional)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Image URL (or upload below)
                    </label>
                    <input
                      type="text"
                      value={bannerFormData.background_image}
                      onChange={(e) => {
                        setBannerFormData({ ...bannerFormData, background_image: e.target.value });
                        setBannerPreviewUrl(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Banner Image
                    </label>

                    {bannerPreviewUrl && (
                      <div className="relative mb-4 rounded-lg overflow-hidden border border-slate-300 bg-slate-50">
                        <img
                          src={bannerPreviewUrl}
                          alt="Banner preview"
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setBannerPreviewUrl('');
                            setBannerFormData({
                              ...bannerFormData,
                              background_image: '',
                            });
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <input
                      ref={bannerFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBannerImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => bannerFileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading || !bannerFormData.background_image}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {editingBannerId ? 'Update' : 'Create'}
                    </button>

                    {editingBannerId && (
                      <button
                        type="button"
                        onClick={() => {
                          setBannerFormData({ title: '', button_text: '', background_image: '' });
                          setEditingBannerId(null);
                          setBannerPreviewUrl('');
                        }}
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
                            {banner.title && (
                              <h3 className="font-semibold text-slate-900 text-lg mb-1">
                                {banner.title}
                              </h3>
                            )}
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
                              onClick={() => handleEditBanner(banner)}
                              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
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
        )}

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  {editingCardId ? 'Edit Card' : 'Add Card'}
                </h2>

                <form onSubmit={handleCardSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={cardFormData.title}
                      onChange={(e) =>
                        setCardFormData({ ...cardFormData, title: e.target.value })
                      }
                      placeholder="Card title"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={cardFormData.description}
                      onChange={(e) =>
                        setCardFormData({ ...cardFormData, description: e.target.value })
                      }
                      placeholder="Card description"
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Image URL (or upload below)
                    </label>
                    <input
                      type="text"
                      value={cardFormData.image_url}
                      onChange={(e) => {
                        setCardFormData({ ...cardFormData, image_url: e.target.value });
                        setCardPreviewUrl(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Card Image
                    </label>

                    {cardPreviewUrl && (
                      <div className="relative mb-4 rounded-lg overflow-hidden border border-slate-300 bg-slate-50">
                        <img
                          src={cardPreviewUrl}
                          alt="Card preview"
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCardPreviewUrl('');
                            setCardFormData({
                              ...cardFormData,
                              image_url: '',
                            });
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <input
                      ref={cardFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCardImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => cardFileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Icon
                      </label>
                      <select
                        value={cardFormData.icon}
                        onChange={(e) =>
                          setCardFormData({ ...cardFormData, icon: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      >
                        {ICON_OPTIONS.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Icon Color
                      </label>
                      <select
                        value={cardFormData.icon_color}
                        onChange={(e) =>
                          setCardFormData({ ...cardFormData, icon_color: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      >
                        {ICON_COLOR_OPTIONS.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Button Action
                    </label>
                    <select
                      value={cardFormData.button_action}
                      onChange={(e) =>
                        setCardFormData({ ...cardFormData, button_action: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    >
                      {BUTTON_ACTION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {cardFormData.button_action === 'link' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={cardFormData.button_text}
                          onChange={(e) =>
                            setCardFormData({ ...cardFormData, button_text: e.target.value })
                          }
                          placeholder="e.g., Learn More"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Button URL
                        </label>
                        <input
                          type="text"
                          value={cardFormData.button_url}
                          onChange={(e) =>
                            setCardFormData({ ...cardFormData, button_url: e.target.value })
                          }
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </>
                  )}

                  {cardFormData.button_action === 'modal' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={cardFormData.button_text}
                          onChange={(e) =>
                            setCardFormData({ ...cardFormData, button_text: e.target.value })
                          }
                          placeholder="e.g., Order Now"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Modal Type
                        </label>
                        <select
                          value={cardFormData.modal_type}
                          onChange={(e) =>
                            setCardFormData({ ...cardFormData, modal_type: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        >
                          {MODAL_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {cardFormData.button_action === 'disabled' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Button Text (shows as disabled)
                      </label>
                      <input
                        type="text"
                        value={cardFormData.button_text}
                        onChange={(e) =>
                          setCardFormData({ ...cardFormData, button_text: e.target.value })
                        }
                        placeholder="e.g., Coming Soon"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  )}

                  {/* Additional Links for cards with multiple links */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Links (for multiple link cards)
                    </label>

                    {cardFormData.additional_links.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {cardFormData.additional_links.map((link, index) => (
                          <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                            <span className="flex-1 text-sm truncate">{link.text}</span>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                              <Link className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveLink(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newLinkText}
                        onChange={(e) => setNewLinkText(e.target.value)}
                        placeholder="Link text"
                        className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      />
                      <input
                        type="text"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="URL"
                        className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddLink}
                        disabled={!newLinkText || !newLinkUrl}
                        className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Featured Card Options */}
                  <div className="border-t pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cardFormData.is_featured}
                        onChange={(e) =>
                          setCardFormData({ ...cardFormData, is_featured: e.target.checked })
                        }
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Featured Card (special styling)
                      </span>
                    </label>

                    {cardFormData.is_featured && (
                      <div className="mt-3 space-y-3 pl-6">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Badge Text
                          </label>
                          <input
                            type="text"
                            value={cardFormData.featured_badge_text}
                            onChange={(e) =>
                              setCardFormData({ ...cardFormData, featured_badge_text: e.target.value })
                            }
                            placeholder="Featured"
                            className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Gradient From
                            </label>
                            <input
                              type="text"
                              value={cardFormData.featured_gradient_from}
                              onChange={(e) =>
                                setCardFormData({ ...cardFormData, featured_gradient_from: e.target.value })
                              }
                              placeholder="rose-600"
                              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Gradient To
                            </label>
                            <input
                              type="text"
                              value={cardFormData.featured_gradient_to}
                              onChange={(e) =>
                                setCardFormData({ ...cardFormData, featured_gradient_to: e.target.value })
                              }
                              placeholder="pink-600"
                              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Coming Soon Overlay */}
                  <div className="border-t pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cardFormData.is_coming_soon}
                        onChange={(e) =>
                          setCardFormData({ ...cardFormData, is_coming_soon: e.target.checked })
                        }
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Coming Soon (shows overlay)
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading || !cardFormData.image_url || !cardFormData.title}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {editingCardId ? 'Update' : 'Create'}
                    </button>

                    {editingCardId && (
                      <button
                        type="button"
                        onClick={resetCardForm}
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
                  Experience Cards
                </h2>

                {cards.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    No cards yet. Create your first card!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className={`border rounded-lg p-4 transition ${
                          card.is_active ? 'border-slate-200 hover:border-slate-300' : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3">
                            <GripVertical className="w-5 h-5 text-slate-400 mt-1 cursor-move" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900 text-lg">
                                  {card.title}
                                </h3>
                                {card.is_featured && (
                                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded-full">
                                    Featured
                                  </span>
                                )}
                                {card.is_coming_soon && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                    Coming Soon
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                                {card.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>Icon: {card.icon}</span>
                                <span>Action: {card.button_action}</span>
                                {card.modal_type && <span>Modal: {card.modal_type}</span>}
                              </div>
                              <p className="text-xs text-slate-400 truncate mt-1">
                                {card.image_url}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleToggleCardActive(card.id, card.is_active)}
                              className={`p-2 rounded transition ${
                                card.is_active
                                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              }`}
                              title={card.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {card.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleEditCard(card)}
                              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCard(card.id)}
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
        )}
      </div>
    </div>
  );
}
