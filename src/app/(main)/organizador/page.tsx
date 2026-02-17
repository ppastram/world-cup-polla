'use client';

import { useState, useEffect } from 'react';
import { UserCheck, Phone, Mail, Send, Newspaper, Loader2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import type { BlogPost } from '@/lib/types';

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'hace un momento';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days}d`;
  const months = Math.floor(days / 30);
  return `hace ${months} mes${months > 1 ? 'es' : ''}`;
}

export default function OrganizadorPage() {
  const { user, profile } = useUser();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
    markAsRead();
  }, [user]);

  async function fetchPosts() {
    const supabase = createClient();
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoadingPosts(false);
  }

  async function markAsRead() {
    if (!user) return;
    const supabase = createClient();
    await supabase
      .from('blog_reads')
      .upsert({ user_id: user.id, last_read_at: new Date().toISOString() }, { onConflict: 'user_id' });
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ author_id: user!.id, title: title.trim(), content: content.trim() })
      .select()
      .single();
    if (!error && data) {
      setPosts([data, ...posts]);
      setTitle('');
      setContent('');
    }
    setSubmitting(false);
  }

  async function handleDeletePost(postId: string) {
    const supabase = createClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
    if (!error) {
      setPosts(posts.filter((p) => p.id !== postId));
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <UserCheck className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Organizador</h1>
          <p className="text-sm text-gray-500">Ampolla Mundialista 2026</p>
        </div>
      </div>

      {/* Bio Card */}
      <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src="/pablopastrana.jpeg"
            alt="Pablo Pastrana"
            className="w-16 h-16 rounded-full border-2 border-gold-500/30 object-cover"
          />
          <div>
            <p className="text-lg font-bold text-white">Pablo Pastrana</p>
            <p className="text-sm text-gray-500">Organizador oficial</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed">
          Soy el organizador de esta ampolla mundialista. Me encargo de administrar los pagos,
          verificar las inscripciones y asegurar que todo funcione correctamente. Si tienes
          alguna duda sobre tu inscripcion, el pago o cualquier aspecto de la polla, no dudes
          en contactarme.
        </p>

        {/* Contact Info */}
        <div className="space-y-3 pt-2">
          <a
            href="tel:3163235264"
            className="flex items-center gap-3 p-3 bg-wc-darker rounded-lg border border-wc-border hover:border-gold-500/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-900/30 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Telefono / WhatsApp</p>
              <p className="text-sm font-medium text-gray-200 group-hover:text-gold-400 transition-colors">
                316 323 5264
              </p>
            </div>
          </a>

          <a
            href="mailto:ppastram@hotmail.com"
            className="flex items-center gap-3 p-3 bg-wc-darker rounded-lg border border-wc-border hover:border-gold-500/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Correo electronico</p>
              <p className="text-sm font-medium text-gray-200 group-hover:text-gold-400 transition-colors">
                ppastram@hotmail.com
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Blog / Novedades Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-gold-400" />
          <h2 className="text-xl font-bold text-white">Novedades</h2>
        </div>

        {/* Admin: Create Post Form */}
        {profile?.is_admin && (
          <form onSubmit={handleCreatePost} className="bg-wc-card border border-wc-border rounded-xl p-4 space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titulo de la novedad"
              className="w-full bg-wc-darker border border-wc-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 text-sm"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe la novedad..."
              rows={3}
              className="w-full bg-wc-darker border border-wc-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 text-sm resize-none"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-gold-500 hover:bg-gold-600 text-black font-bold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Publicar
            </button>
          </form>
        )}

        {/* Posts List */}
        {loadingPosts ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-wc-card border border-wc-border rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm">No hay novedades aun.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-wc-card border border-wc-border rounded-xl p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-white">{post.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-600">{timeAgo(post.created_at)}</span>
                    {profile?.is_admin && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
