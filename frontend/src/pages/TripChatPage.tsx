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
} from 'lucide-react';

export const TripChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
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
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();

    // Polling interval for MVP live coordination (5s)
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [id, user]);

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-96 rounded-2xl bg-white border border-slate-200 animate-pulse p-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-6 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-700 mx-auto" />
          <h2 className="text-base font-bold">{t('chat.not_authorized', 'Accès restreint aux membres du trajet')}</h2>
          <p className="text-xs text-rose-700 leading-relaxed">
            Seuls le conducteur et les passagers ayant une réservation confirmée pour ce trajet peuvent accéder à ce fil de discussion.
          </p>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="text-xs font-bold text-emerald-700 hover:underline"
        >
          Retourner aux recherches
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      {/* Route context header */}
      {trip && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Messagerie Interne de Coordination</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{trip.origin_city}</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
              <span>{trip.destination_city}</span>
            </h1>
            <p className="text-xs text-slate-500">
              Départ : {new Date(trip.departure_datetime).toLocaleString('fr-DZ')} • Conducteur : <strong>{trip.driver?.full_name}</strong>
            </p>
          </div>

          <button
            onClick={() => navigate(`/trips/${trip.id}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Fiche trajet</span>
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 h-[500px] flex flex-col justify-between">
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-20 space-y-2">
              <MessageCircle className="w-10 h-10 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">Aucun message pour l'instant</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Utilisez cette messagerie pour coordonner le point de rendez-vous exact, les bagages ou l'heure de départ.
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
                    {msg.sender?.full_name || 'Utilisateur'} • {timeString}
                  </span>

                  <div
                    className={`max-w-md rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed ${
                      isMe
                        ? 'bg-emerald-700 text-white rounded-br-none shadow-xs'
                        : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-bl-none'
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
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Écrivez un message de coordination..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !inputContent.trim()}
            className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};