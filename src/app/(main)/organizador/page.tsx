'use client';

import { useState, useEffect } from 'react';
import { UserCheck, Phone, Mail, Send, Newspaper, Loader2, Trash2, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useTranslation } from '@/i18n';
import type { BlogPost } from '@/lib/types';

function useTimeAgo() {
  const { t } = useTranslation();
  return (dateStr: string): string => {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return t('timeAgo.justNow');
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t('timeAgo.minutes', { n: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('timeAgo.hours', { n: hours });
    const days = Math.floor(hours / 24);
    if (days < 30) return t('timeAgo.days', { n: days });
    const months = Math.floor(days / 30);
    return t('timeAgo.months', { n: months, s: months > 1 ? 's' : '' });
  };
}

export default function OrganizadorPage() {
  const { user, profile } = useUser();
  const { t } = useTranslation();
  const timeAgo = useTimeAgo();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

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
      const postTitle = title.trim();
      const postContent = content.trim();
      setTitle('');
      setContent('');
      setSendEmail(false);
      setSubmitting(false);

      if (sendEmail) {
        setEmailStatus('sending');
        try {
          await fetch('/api/email/send-blog-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: postTitle, content: postContent }),
          });
        } catch (err) {
          console.error('Error sending blog post emails:', err);
        }
        setEmailStatus('sent');
        setTimeout(() => setEmailStatus('idle'), 3000);
      }
      return;
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
          <h1 className="text-2xl font-bold text-white">{t('organizer.title')}</h1>
          <p className="text-sm text-gray-500">{t('organizer.subtitle')}</p>
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
            <p className="text-sm text-gray-500">{t('organizer.role')}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed">
          {t('organizer.bio')}
          <br/> <br/>
          {t('organizer.bio2')}
          {' '}
          {t('organizer.bio3')}
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
              <p className="text-xs text-gray-500">{t('organizer.phone')}</p>
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
              <p className="text-xs text-gray-500">{t('organizer.email')}</p>
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
          <h2 className="text-xl font-bold text-white">{t('organizer.news')}</h2>
        </div>

        {/* Admin: Create Post Form */}
        {profile?.is_admin && (
          <form onSubmit={handleCreatePost} className="bg-wc-card border border-wc-border rounded-xl p-4 space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('organizer.newsTitle')}
              className="w-full bg-wc-darker border border-wc-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 text-sm"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('organizer.newsContent')}
              rows={3}
              className="w-full bg-wc-darker border border-wc-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 text-sm resize-none"
              required
            />
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 rounded border-wc-border bg-wc-darker accent-gold-500"
              />
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{t('organizer.sendEmailToAll')}</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gold-500 hover:bg-gold-600 text-black font-bold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t('organizer.publish')}
              </button>
              {emailStatus === 'sending' && (
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t('organizer.sendingEmails')}
                </span>
              )}
              {emailStatus === 'sent' && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t('organizer.emailsSent')}
                </span>
              )}
            </div>
          </form>
        )}

        {/* Posts List */}
        {loadingPosts ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-wc-card border border-wc-border rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm">{t('organizer.noNews')}</p>
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
