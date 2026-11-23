import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip, TripMessage } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Send,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  User,
  Clock,
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
      setError(err.message || 'Accès non autorisé ou trajet introuvable');
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
        <div className="h-96 rounded-2xl bg-white border border-[#EAE5DC] animate-pulse p-8 shadow-xs" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="p-8 bg-[#FCF7F3] text-[#141716] rounded-2xl border border-[#D96B27]/30 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#FCF7F3] text-[#A14114] border border-[#D96B27]/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-serif font-bold text-[#141716]">{t('chat.not_authorized', 'Accès restreint aux membres du trajet')}</h2>
          <p className="text-xs text-[#5A625D] leading-relaxed">
            Seuls le conducteur et les passagers ayant une réservation confirmée pour ce trajet peuvent accéder à ce fil de discussion de coordination.
          </p>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16382C] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Retourner aux recherches
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
      {/* Route context header */}
      {trip && (
        <div className="bg-white rounded-2xl border border-[#EAE5DC] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#16382C] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#16382C] animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-[#16382C]" />
              <span className="uppercase tracking-wider">Messagerie de Coordination de Trajet</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-[#141716] flex items-center gap-2.5">
              <span>{trip.origin_city}</span>
              <ArrowRight className="w-4 h-4 text-[#D96B27]" />
              <span>{trip.destination_city}</span>
            </h1>
            <p className="text-xs text-[#5A625D]">
              Départ : {new Date(trip.departure_datetime).toLocaleString('fr-DZ', { dateStyle: 'medium', timeStyle: 'short' })} • Conducteur : <strong className="text-[#141716] font-semibold">{trip.driver?.full_name}</strong>
            </p>
          </div>

          <button
            onClick={() => navigate(`/trips/${trip.id}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] text-xs font-bold text-[#141716] hover:border-[#16382C] hover:text-[#16382C] transition-all shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Fiche trajet</span>
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="bg-white rounded-2xl border border-[#EAE5DC] shadow-xs p-5 sm:p-6 h-[540px] flex flex-col justify-between">
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#7E8681] py-20 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EAE5DC] flex items-center justify-center text-[#16382C]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#141716]">Aucun message pour l'instant</p>
              <p className="text-xs text-[#5A625D] max-w-sm leading-relaxed">
                Utilisez cette messagerie sécurisée pour fixer le lieu précis de prise en charge, les détails des bagages ou synchroniser l'heure de départ.
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
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <span className="text-[10px] font-semibold text-[#7E8681] px-1">
                    {msg.sender?.full_name || 'Utilisateur'} • {timeString}
                  </span>

                  <div
                    className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#16382C] text-[#FAF7F2] rounded-br-none shadow-xs font-medium'
                        : 'bg-[#FAF7F2] text-[#141716] border border-[#EAE5DC] rounded-bl-none font-medium'
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
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-[#EAE5DC] flex gap-2.5">
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Écrivez un message de coordination..."
            className="flex-1 rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] px-4 py-3 text-xs font-medium text-[#141716] placeholder-[#7E8681] focus:bg-white focus:outline-none focus:border-[#16382C] focus:ring-1 focus:ring-[#16382C] transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !inputContent.trim()}
            className="px-6 py-3 rounded-xl bg-[#16382C] hover:bg-[#0F281F] disabled:bg-[#EAE5DC] disabled:text-[#7E8681] text-[#FAF7F2] font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};