import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Send,
  Lock
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { encryptMessage, decryptMessage } from '../lib/crypto';
import { Message } from '../types';

const MessageBubble = ({ msg, currentUserId }: { msg: Message, currentUserId: string }) => {
  const [decryptedContent, setDecryptedContent] = useState<string>('Decrypting...');

  useEffect(() => {
    if (msg.iv) {
      decryptMessage(msg.content, msg.iv, msg.senderId, msg.receiverId)
        .then(setDecryptedContent)
        .catch(() => setDecryptedContent('Failed to decrypt'));
    } else {
      setDecryptedContent(msg.content);
    }
  }, [msg]);

  return (
    <div 
      key={msg.id}
      className={cn(
        "flex flex-col max-w-[80%]",
        msg.senderId === currentUserId ? "ml-auto items-end" : "items-start"
      )}
    >
      <div className={cn(
        "p-3 rounded-[1.5rem] text-sm",
        msg.senderId === currentUserId 
          ? "bg-ruru-navy-light text-white rounded-tr-none" 
          : "bg-[#F5F5F0] text-ruru-navy-light rounded-tl-none"
      )}>
        {decryptedContent}
      </div>
      <span className="text-[9px] text-[#A8A29E] mt-1 flex items-center gap-1">
        {msg.iv && <Lock size={8} />}
        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export function ChatView() {
  const { userProfile, vets, messages, sendMessage, markMessageRead, role } = useStore();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversationPartners = React.useMemo(() => {
    if (role === 'owner') return vets;
    
    // For vets/providers, show anyone who has sent them a message or received one
    const partnerIds = new Set<string>();
    messages.forEach(m => {
      if (m.receiverId === userProfile?.uid) partnerIds.add(m.senderId);
      if (m.senderId === userProfile?.uid) partnerIds.add(m.receiverId);
    });
    
    return Array.from(partnerIds).map(id => {
      const isVet = vets.find(v => v.uid === id);
      return isVet || { uid: id, name: "Client/Patient " + id.slice(0,4), role: 'owner', email: '' };
    });
  }, [vets, messages, userProfile?.uid, role]);

  const selectedPartner = conversationPartners.find(p => p.uid === selectedPartnerId);

  const chatMessages = React.useMemo(() => {
    return messages.filter(m => 
      (m.senderId === userProfile?.uid && m.receiverId === selectedPartnerId) ||
      (m.senderId === selectedPartnerId && m.receiverId === userProfile?.uid)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, userProfile?.uid, selectedPartnerId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const unread = chatMessages.filter(m => m.receiverId === userProfile?.uid && !m.read);
    unread.forEach(m => markMessageRead(m.id));
  }, [chatMessages, userProfile?.uid, markMessageRead]);

  const handleSend = async () => {
    if (!input.trim() || !selectedPartnerId || !userProfile) return;
    
    const { cipher, iv } = await encryptMessage(input.trim(), userProfile.uid, selectedPartnerId);

    await sendMessage({
      senderId: userProfile.uid,
      receiverId: selectedPartnerId,
      content: cipher,
      iv: iv
    });
    setInput('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col bg-[#FDFCFB]"
    >
      <div className="p-6 border-b border-ruru-navy/10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-brand">Consultations</h2>
          <p className="text-ruru-navy/60">{role === 'owner' ? 'Direct messages with your veterinarians' : 'Direct messages with your clients'}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-ruru-navy/60 bg-[#F5F5F0] px-3 py-1.5 rounded-full border border-ruru-navy/10">
          <Lock size={12} className="text-emerald-600" />
          <span>End-to-End Encrypted</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Contact List */}
        <div className="w-1/3 border-r border-ruru-navy/10 overflow-y-auto p-4 space-y-2">
          {conversationPartners.length === 0 ? (
            <p className="text-xs text-ruru-navy/60 text-center mt-8">No contacts available yet.</p>
          ) : (
            conversationPartners.map(partner => (
              <button
                key={partner.uid}
                onClick={() => setSelectedPartnerId(partner.uid)}
                className={cn(
                  "w-full p-3 rounded-[1.5rem] flex items-center gap-3 transition-all",
                  selectedPartnerId === partner.uid ? "bg-ruru-navy-light text-white shadow-lg" : "hover:bg-[#F5F5F0] text-ruru-navy-light"
                )}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                  <img src={(partner as any).image || `https://picsum.photos/seed/${partner.uid}/100`} alt={partner.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold truncate">{partner.name}</p>
                  <p className={cn("text-[10px] truncate", selectedPartnerId === partner.uid ? "text-white/70" : "text-ruru-navy/60")}>
                     {role === 'owner' ? 'Veterinarian' : 'Client'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white/95 backdrop-blur-3xl">
          {selectedPartner ? (
            <>
              <div className="p-4 border-b border-ruru-navy/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={(selectedPartner as any).image || `https://picsum.photos/seed/${selectedPartner.uid}/100`} alt={selectedPartner.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-ruru-navy-light">{selectedPartner.name}</h4>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-ruru-teal rounded-full" />
                    <span className="text-[10px] text-ruru-navy/60">Online</span>
                  </div>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <MessageSquare size={48} className="mb-4" />
                    <p className="text-sm">Start a secure conversation with {selectedPartner.name}</p>
                  </div>
                ) : (
                  chatMessages.map(msg => (
                    <MessageBubble key={msg.id} msg={msg} currentUserId={userProfile?.uid || ''} />
                  ))
                )}
              </div>

              <div className="p-4 border-t border-ruru-navy/10">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your secure message..."
                    className="flex-1 bg-[#F5F5F0] border-none rounded-[1.25rem] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ruru-navy-light/20"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-10 h-10 bg-ruru-navy-light text-white rounded-[1.25rem] flex items-center justify-center hover:bg-[#4A4A35] transition-colors disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
              <div className="w-16 h-16 bg-[#F5F5F0] rounded-[1.5rem] flex items-center justify-center mb-4">
                <Lock size={32} />
              </div>
              <h3 className="font-brand text-xl mb-2">Select a Contact</h3>
              <p className="text-sm max-w-[200px]">Choose a contact from the list to start a secure, end-to-end encrypted direct consultation.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
