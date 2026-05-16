import ChatHeader from './ChatHeader';
import ConversationPanel from './ConversationPanel';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

function ChatPage({
  conversations,
  messages,
  selectedConversation,
  status,
  typingUser,
  user,
  users,
  onCreateConversation,
  onLeaveGroup,
  onLogout,
  onSelectConversation,
  onSendMessage,
  onStopTyping,
  onTyping
}) {
  return (
    <main className="min-h-screen bg-[#cfdbe7] p-0 text-[#111827] md:p-4">
      <div className="mx-auto grid h-screen max-w-[1440px] overflow-hidden bg-white shadow-xl shadow-slate-400/20 md:h-[calc(100vh-32px)] md:rounded-xl md:border md:border-[#b7c5d3] lg:grid-cols-[360px_1fr]">
        <ConversationPanel
          conversations={conversations}
          currentUser={user}
          selectedConversation={selectedConversation}
          users={users}
          onCreateConversation={onCreateConversation}
          onSelectConversation={onSelectConversation}
        />

        <div className="grid min-h-0 grid-rows-[auto_1fr_auto] bg-[#efeae2]">
          <ChatHeader
            conversation={selectedConversation}
            status={status}
            user={user}
            onLeaveGroup={onLeaveGroup}
            onLogout={onLogout}
          />

          <section className="chat-background overflow-y-auto px-4 py-5 md:px-8">
            {selectedConversation ? (
              <div className="mx-auto grid max-w-4xl gap-3">
                <MessageList messages={messages} currentUser={user} />
                {typingUser && (
                  <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm text-[#64748b] shadow-sm">
                    <span>{typingUser} is typing</span>
                    <span className="typing-dot" />
                    <span className="typing-dot animation-delay-150" />
                    <span className="typing-dot animation-delay-300" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full min-h-80 items-center justify-center rounded-md border border-dashed border-[#cbd5e1] bg-white/70 text-sm text-[#64748b]">
                Select or create a chat.
              </div>
            )}
          </section>

          <MessageForm
            disabled={!selectedConversation}
            onSend={onSendMessage}
            onStopTyping={onStopTyping}
            onTyping={onTyping}
          />
        </div>
      </div>
    </main>
  );
}

export default ChatPage;
