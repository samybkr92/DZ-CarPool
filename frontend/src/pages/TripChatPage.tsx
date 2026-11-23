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
        <div className="h-96 rounded-xl bg-white border border-[#E6E0D6] animate-pulse p-8 shadow-card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="p-8 bg-rose-50 text-[#141613] rounded-xl border border-rose-200 space-y-3 shadow-subtle">
          <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#141613]">Accès réservé aux membres du trajet</h2>
          <p className="text-xs text-[#5C6057] leading-relaxed">
            Seuls le conducteur et les passagers ayant une réservation confirmée pour ce trajet peuvent accéder à ce fil de discussion.
          </p>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173C2C] hover:underline"
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
        <div className="bg-white rounded-xl border border-[#E6E0D6] p-5 sm:p-6 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#173C2C] tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-[#173C2C]" />
              <span>Messagerie Interne du Trajet</span>
            </div>
            <h1 className="text-xl font-extrabold text-[#141613] flex items-center gap-2.5">
              <span>{trip.origin_city}</span>
              <ArrowRight className="w-4 h-4 text-[#173C2C]" />
              <span>{trip.destination_city}</span>
            </h1>
            <p className="text-xs text-[#5C6057]">
              Départ : {new Date(trip.departure_datetime).toLocaleString('fr-DZ', { dateStyle: 'medium', timeStyle: 'short' })} • Conducteur : <strong className="text-[#141613] font-semibold">{trip.driver?.full_name}</strong>
            </p>
          </div>

          <Link
            to={`/trips/${trip.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-bold text-[#32362F] hover:bg-[#F3EFE8] transition-colors shadow-subtle"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Fiche trajet</span>
          </Link>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="bg-white rounded-xl border border-[#E6E0D6] shadow-card p-5 sm:p-6 h-[540px] flex flex-col justify-between">
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#8E9389] py-20 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#E6E0D6] flex items-center justify-center text-[#8E9389]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#32362F]">Aucun message pour l'instant</p>
              <p className="text-xs text-[#5C6057] max-w-sm leading-relaxed">
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
                  <span className="text-[10px] font-semibold text-[#8E9389] px-1">
                    {msg.sender?.full_name || 'Membre'} • {timeString}
                  </span>

                  <div
                    className={`max-w-md rounded-lg px-4 py-2.5 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#173C2C] text-white rounded-br-none shadow-subtle font-medium'
                        : 'bg-[#F3EFE8] text-[#141613] rounded-bl-none font-medium'
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
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-[#F3EFE8] flex gap-2">
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Écrivez un message de coordination..."
            className="flex-1 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] px-4 py-2.5 text-xs font-medium text-[#141613] placeholder-[#8E9389] focus:bg-white focus:outline-none focus:border-[#173C2C] transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !inputContent.trim()}
            className="px-5 py-2.5 rounded-lg bg-[#173C2C] hover:bg-[#112E22] disabled:bg-[#FAF8F5] disabled:text-[#8E9389] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-subtle"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};
