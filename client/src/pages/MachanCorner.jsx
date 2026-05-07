import { useState, useRef, useEffect } from 'react';

const friends = [];

const chatMessages = {
  f1: [
    { id: 1, sender: 'friend', text: 'Machan, did you finish the Advanced Calculus notes for Module 3? Professor Singh mentioned they\'ll be in the PYQs.', time: '10:42 AM' },
    { id: 2, sender: 'me', text: 'Almost done! Just adding the practice diagrams from the 2022 paper. Sending it over now.', time: '10:44 AM' },
    { id: 3, sender: 'me', text: null, time: '10:45 AM', type: 'file', fileName: 'Calculus_Mod3_Notes.pdf', fileSize: '1.2 MB' },
    { id: 4, sender: 'friend', text: 'This diagram helps a lot. Thanks machan!', time: '10:48 AM', type: 'image' },
  ],
};

export default function MachanCorner() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [addMobile, setAddMobile] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedFriend) {
      setMessages(chatMessages[selectedFriend.id] || []);
    }
  }, [selectedFriend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), sender: 'me', text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate friend reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'friend',
        text: 'Got it machan! Let me check and get back to you.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 2000);
  };

  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Chat view
  if (selectedFriend) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-180px)]">
        {/* Chat Header */}
        <section className="glass-vessel rounded-2xl p-gutter flex items-center justify-between shadow-xl mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedFriend(null)} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              arrow_back
            </button>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-white/50">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              {selectedFriend.online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full animate-status-pulse" />
              )}
            </div>
            <div>
              <h3 className="font-grotesk text-base font-bold text-on-surface leading-tight">{selectedFriend.name}</h3>
              <p className={`text-caption font-medium ${selectedFriend.online ? 'text-primary' : 'text-on-surface-variant'}`}>
                {selectedFriend.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined">call</span>
            </button>
          </div>
        </section>

        {/* Messages */}
        <section className="flex-1 flex flex-col gap-6 overflow-y-auto scrollbar-hide py-4">
          <div className="flex justify-center">
            <span className="px-4 py-1 glass-white-bubble rounded-full text-[10px] uppercase tracking-widest text-on-surface-variant/80 font-bold">Today</span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col gap-1 max-w-[85%] ${msg.sender === 'me' ? 'items-end ml-auto' : 'items-start'}`}>
              {msg.type === 'file' ? (
                <div className={`${msg.sender === 'me' ? 'glass-mint-bubble rounded-tr-none' : 'glass-white-bubble rounded-tl-none'} rounded-2xl p-3 w-full border-l-4 border-primary`}>
                  <div className="flex items-center gap-3 bg-white/20 p-2 rounded-xl">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">description</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md font-bold truncate">{msg.fileName}</p>
                      <p className="text-caption text-on-surface-variant">{msg.fileSize} • PDF</p>
                    </div>
                    <span className="material-symbols-outlined text-primary cursor-pointer">download</span>
                  </div>
                </div>
              ) : msg.type === 'image' ? (
                <div className={`${msg.sender === 'me' ? 'glass-mint-bubble rounded-tr-none' : 'glass-white-bubble rounded-tl-none'} rounded-2xl p-2 shadow-sm`}>
                  <div className="w-full h-48 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary/40 text-[48px]">image</span>
                  </div>
                  {msg.text && <p className="mt-2 px-2 pb-1 text-on-surface font-inter text-body-md">{msg.text}</p>}
                </div>
              ) : (
                <div className={`${msg.sender === 'me' ? 'glass-mint-bubble rounded-tr-none' : 'glass-white-bubble rounded-tl-none'} rounded-2xl p-4 ${msg.sender === 'me' ? '' : 'shadow-sm'}`}>
                  <p className="text-on-surface font-inter text-body-md">{msg.text}</p>
                </div>
              )}
              <div className="flex items-center gap-1 px-1">
                <span className="text-[10px] text-on-surface-variant">{msg.time}</span>
                {msg.sender === 'me' && (
                  <span className="material-symbols-outlined text-[14px] text-primary filled">done_all</span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </section>

        {/* Input */}
        <section className="mt-4">
          <form onSubmit={sendMessage} className="glass-vessel rounded-full p-2 pl-6 flex items-center gap-2 shadow-2xl">
            <button type="button" className="material-symbols-outlined text-on-surface-variant/70 hover:text-primary transition-colors">add_circle</button>
            <button type="button" className="material-symbols-outlined text-on-surface-variant/70 hover:text-primary transition-colors">image</button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${selectedFriend.name.split(' ')[0]}...`}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface placeholder-on-surface-variant/50 font-inter text-body-md"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,161,155,0.4)] active:scale-90 transition-transform disabled:opacity-50"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </section>
      </div>
    );
  }

  // Friend list view
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-stack-md">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">diversity_3</span>
          <h2 className="font-grotesk text-h2 text-on-surface">Machan Corner</h2>
        </div>
        <button
          onClick={() => setShowAddFriend(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-grotesk text-caption shadow-lg hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Add Machan
        </button>
      </div>

      {/* Online count */}
      <div className="glass-card rounded-xl p-4 mb-4 flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        <span className="text-body-md text-on-surface">
          <strong className="text-primary">{friends.filter(f => f.online).length}</strong> friends online
        </span>
      </div>

      {/* Search */}
      <div className="glass-vessel rounded-xl p-2 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-on-surface-variant text-sm ml-2">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search friends..."
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 font-inter text-body-md"
        />
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="glass-card rounded-2xl p-6 mb-4 border-2 border-primary/20">
          <h4 className="font-grotesk text-action mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person_add</span>
            Add New Machan
          </h4>
          <div className="flex gap-2">
            <input
              type="tel"
              value={addMobile}
              onChange={(e) => setAddMobile(e.target.value)}
              placeholder="Enter mobile number"
              className="flex-1 h-12 px-4 bg-white/10 border border-white/40 rounded-xl text-body-md font-inter focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
            <button
              onClick={() => { setShowAddFriend(false); setAddMobile(''); }}
              className="px-4 h-12 bg-primary text-on-primary rounded-xl font-grotesk text-caption hover:opacity-90 active:scale-95 transition-all"
            >
              Send Request
            </button>
          </div>
          <button onClick={() => setShowAddFriend(false)} className="mt-2 text-caption text-on-surface-variant hover:text-primary transition-colors">
            Cancel
          </button>
        </div>
      )}

      {/* Friend List */}
      <div className="space-y-2">
        {filteredFriends.map((friend) => (
          <button
            key={friend.id}
            onClick={() => setSelectedFriend(friend)}
            className="w-full text-left glass-card rounded-2xl p-4 flex items-center gap-4 hover:translate-y-[-2px] transition-all group"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-white/50">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              {friend.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-grotesk text-on-surface font-semibold group-hover:text-primary transition-colors">{friend.name}</h4>
                <span className="text-[10px] text-on-surface-variant">{friend.time}</span>
              </div>
              <p className="text-caption text-on-surface-variant truncate">{friend.lastMsg}</p>
            </div>
            {friend.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] flex items-center justify-center font-bold">
                {friend.unread}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
