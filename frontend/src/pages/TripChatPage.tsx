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

    // Polling interval for live coordination (5s)
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
        <div className="h-96 rounded-xl bg-[#131D2E] border border-[#1E2C42] animate-pulse p-8 shadow-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="p-8 bg-rose-950/60 text-white rounded-xl border border-rose-800 space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-lg bg-rose-900/80 text-rose-300 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="text-base font-bold text-white">Accès réservé aux membres du trajet</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Seuls le conducteur et les passagers ayant une réservation confirmée pour ce trajet peuvent accéder à ce fil de discussion.
          </p>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#60A5FA] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Retourner aux recherches</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5 text-left">
      {/* Route context header */}
      {trip && (
        <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#60A5FA] tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
              <span>Messagerie Interne du Trajet</span>
            </div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5">
              <span>{trip.origin_city}</span>
              <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
              <span>{trip.destination_city}</span>
            </h1>
            <p className="text-xs text-slate-400">
              Départ : {new Date(trip.departure_datetime).toLocaleString('fr-DZ', { dateStyle: 'medium', timeStyle: 'short' })} • Conducteur : <strong className="text-white font-semibold">{trip.driver?.full_name}</strong>
            </p>
          </div>

          <Link
            to={`/trips/${trip.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-slate-300 hover:text-white hover:border-[#2563EB] transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Fiche trajet</span>
          </Link>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-6 shadow-xl space-y-4">
        <div className="h-96 overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <MessageCircle className="w-8 h-8 text-slate-500" />
              <p className="text-xs font-semibold text-slate-300">Aucun message pour ce trajet pour le moment.</p>
              <p className="text-[11px] text-slate-500">Posez vos questions sur le point de rendez-vous ou les bagages.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              const senderName = msg.sender?.full_name || (isMe ? 'Moi' : 'Membre');
              const msgTime = new Date(msg.created_at).toLocaleTimeString('fr-DZ', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                    <span className="font-bold text-white">{senderName}</span>
                    <span>•</span>
                    <span>{msgTime}</span>
                  </div>

                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#2563EB] text-white rounded-br-none shadow-md shadow-blue-600/30'
                        : 'bg-[#18253A] border border-[#1E2C42] text-slate-200 rounded-bl-none'
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

        {/* Input Message Form */}
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-[#1E2C42] flex items-center gap-2">
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Écrire un message pour coordonner le trajet..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
          <button
            type="submit"
            disabled={sending || !inputContent.trim()}
            className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all active:scale-[0.98]"
          >
            <span>Envoyer</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
