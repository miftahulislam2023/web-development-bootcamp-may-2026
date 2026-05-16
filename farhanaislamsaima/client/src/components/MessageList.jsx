function getInitial(name) {
  return name ? name.slice(0, 1).toUpperCase() : '?';
}

function getMessageTime(date) {
  if (!date) {
    return '';
  }

  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function MessageList({ messages, currentUser }) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full min-h-80 items-center justify-center rounded-md bg-white/75 text-sm text-[#64748b] shadow-sm">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isMine = message.user === currentUser.name;
        const time = getMessageTime(message.createdAt);

        return (
          <div
            key={message.id || message._id || message.createdAt}
            className={`flex items-end gap-2 ${
              isMine ? 'justify-end' : 'justify-start'
            }`}
          >
            {!isMine && (
              <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#cbd5e1] text-xs font-semibold text-[#475569]">
                {getInitial(message.user)}
              </div>
            )}

            <div
              className={`max-w-[75%] ${
                isMine ? 'items-end text-right' : 'items-start text-left'
              } flex flex-col`}
            >
              <div className="mb-1 flex items-center gap-2 px-1 text-[11px] text-[#64748b]">
                <span className="font-medium">{message.user}</span>
                {time && <span>{time}</span>}
              </div>

              <div
                className={`grid gap-2 px-3.5 py-2 text-sm leading-6 shadow-sm ${
                  isMine
                    ? 'rounded-2xl rounded-br-sm bg-[#d9fdd3] text-[#111827]'
                    : 'rounded-2xl rounded-bl-sm bg-white text-[#111827]'
                }`}
              >
                {message.imageUrl && (
                  <img
                    alt="Chat upload"
                    className="max-h-72 max-w-full rounded-lg object-contain"
                    src={message.imageUrl}
                  />
                )}
                {message.text && <span>{message.text}</span>}
              </div>
            </div>

            {isMine && (
              <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2aabee] text-xs font-semibold text-white">
                {getInitial(message.user)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
