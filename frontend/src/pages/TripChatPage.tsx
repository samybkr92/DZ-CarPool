import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip, TripMessage } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Send,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';

export const TripChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [messages, setMessages] = useState<TripMessage[]>([]);
  const [inputContent, setInputContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async () => {
    if (!id) return;
    try {
      const tripId = parseInt(id, 10);
      const [tripData, msgData] = await Promise.all([
        api.getTrip(tripId),
        api.getTripMessages(tripId),
      ]);
      setTrip(tripData);
      setMessages(msgData);
    } catch (err: any) {
      setError(err.message || 'Accès restreint aux membres du trajet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      loadData();
    }

    // Polling interval for MVP live coordination (5s)
    const interval = setInterval(() => {
      if (user) loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, [id, user, authLoading, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !id) return;

    setSending(true);
    try {
      const newMsg = await api.sendTripMessage(parseInt(id, 10), inputContent.trim());
      setMessages((prev) => [...prev, newMsg]);
      setInputContent('');
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="h-96 rounded-3xl bg-white border border-slate-200 animate-pulse p-8 shadow-soft-sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="p-8 bg-rose-50 text-slate-900 rounded-3xl border border-rose-200 space-y-3 shadow-soft-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Accès réservé aux passagers du trajet</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Seuls le conducteur et les passagers ayant une réservation confirmée pour ce trajet peuvent accéder à ce fil de discussion.
          </p>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Retourner aux recherches
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5 text-left">
      {/* Route context header */}
      {trip && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-soft-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-bold text-brand-700 tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Messagerie Interne du Trajet</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
              <span>{trip.origin_city}</span>
              <ArrowRight className="w-4 h-4 text-brand-600" />
              <span>{trip.destination_city}</span>
            </h1>
            <p className="text-xs text-slate-500">
              Départ : {new Date(trip.departure_datetime).toLocaleString('fr-DZ', { dateStyle: 'medium', timeStyle: 'short' })} • Conducteur : <strong className="text-slate-900 font-semibold">{trip.driver?.full_name}</strong>
            </p>
          </div>

          <Link
            to={`/trips/${trip.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-soft-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Fiche trajet</span>
          </Link>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-sm p-5 sm:p-6 h-[540px] flex flex-col justify-between">
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-20 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">Aucun message pour l'instant</p>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Utilisez cette messagerie sécurisée pour convenir du point de rendez-vous exact, des bagages ou synchroniser l'heure de départ.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              const timeString = new Date(msg.created_at).toLocaleTimeString('fr-DZ', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <span className="text-[10px] font-semibold text-slate-400 px-1">
                    {msg.sender?.full_name || 'Membre'} • {timeString}
                  </span>

                  <div
                    className={`max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-brand-600 text-white rounded-br-none shadow-soft-xs font-medium'
                        : 'bg-slate-100 text-slate-900 rounded-bl-none font-medium'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer Form */}
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 flex gap-2.5">
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Écrivez un message de coordination..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-600 transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !inputContent.trim()}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-soft-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};