import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Phone,
  CheckCheck,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ChatMessage, BusTrip } from '../types';

interface DriverChatModalProps {
  bus: BusTrip;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  'Where is the bus right now?',
  'Will you stop at Silk Board junction?',
  'I am running 5 minutes late, please hold!',
  'What is the expected dinner halt time?',
];

export const DriverChatModal: React.FC<DriverChatModalProps> = ({ bus, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'driver',
      text: `Namaste! I am your Primo Captain ${bus.driverName}. Bus (${bus.vehicleNo}) is currently on schedule and sanitized. Feel free to message me for boarding assistance.`,
      timestamp: '21:15',
      status: 'read',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isDriverTyping, setIsDriverTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isDriverTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Update status to delivered then read
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'delivered' } : m))
      );
    }, 500);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'read' } : m))
      );
      setIsDriverTyping(true);
    }, 1000);

    // Simulate driver reply
    setTimeout(() => {
      setIsDriverTyping(false);
      let replyText = 'Understood! See you shortly aboard the bus.';
      let isLocation = false;

      const lower = text.toLowerCase();
      if (lower.includes('where') || lower.includes('location')) {
        replyText = `We are currently cruising near ${bus.boardingPoints[1]?.name || 'Electronic City'}, moving at 68 km/h. Arriving at next stop in ~12 minutes.`;
        isLocation = true;
      } else if (lower.includes('silk board') || lower.includes('stop')) {
        replyText = `Yes! We halt at Silk Board under Flyover Pillar 14. Reporting time is ${bus.boardingPoints[1]?.time || '21:45'}.`;
      } else if (lower.includes('late') || lower.includes('hold')) {
        replyText = `Noted! Please hurry safely to the pickup spot. I will coordinate with the conductor and hold for up to 5 minutes.`;
      } else if (lower.includes('dinner') || lower.includes('halt') || lower.includes('food')) {
        replyText = `Dinner halt is scheduled at A2B Highway Plaza around 23:45 for 25 minutes. Restrooms are sanitized and hot meals are available.`;
      }

      const driverReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'driver',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
        isLocationShare: isLocation,
      };

      setMessages((prev) => [...prev, driverReply]);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0b141a] rounded-3xl shadow-2xl max-w-md w-full h-[620px] max-h-[92vh] flex flex-col overflow-hidden border border-slate-700 text-white">
        {/* WhatsApp-Style Header */}
        <div className="px-4 py-3 bg-[#1f2c34] flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-emerald-500 flex items-center justify-center text-lg">
              👨‍✈️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{bus.driverName}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-emerald-400">
                Online · Primo Captain ({bus.vehicleNo})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${bus.driverPhone}`}
              className="p-2 bg-[#2a3942] hover:bg-[#374248] rounded-full text-emerald-400 cursor-pointer"
              title="Call Captain"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 bg-[#2a3942] hover:bg-[#374248] rounded-full text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat History Canvas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] bg-opacity-90">
          <div className="text-center my-2">
            <span className="text-[10px] bg-[#182229] text-slate-400 px-3 py-1 rounded-full border border-slate-800">
              Messages are encrypted & monitored for passenger safety
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs relative ${
                    isMe
                      ? 'bg-[#005c4b] text-white rounded-br-xs'
                      : 'bg-[#202c33] text-slate-100 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {m.isLocationShare && (
                    <div className="mt-2 p-2 bg-black/30 rounded-xl border border-emerald-500/30 flex items-center gap-2 text-[11px]">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold text-white block">Live Highway Coordinate Pin</span>
                        <span className="text-emerald-400 font-mono text-[10px]">
                          12.9226° N, 77.6174° E · 68 km/h
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                    <span>{m.timestamp}</span>
                    {isMe && (
                      <CheckCheck
                        className={`w-3.5 h-3.5 ${
                          m.status === 'read' ? 'text-sky-400' : 'text-slate-400'
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isDriverTyping && (
            <div className="flex items-center gap-2 bg-[#202c33] text-slate-300 text-xs px-3 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] text-slate-400 ml-1">Captain is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Taps Drawer */}
        <div className="p-2 bg-[#111b21] border-t border-[#202c33] flex items-center gap-1.5 overflow-x-auto text-nowrap">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-[11px] text-slate-200 border border-slate-700 cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Strip */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#202c33] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type message to Captain..."
            className="flex-1 bg-[#2a3942] text-xs text-white placeholder-slate-400 px-4 py-2.5 rounded-full focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#029070] disabled:bg-slate-700 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
