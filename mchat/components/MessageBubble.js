export default function MessageBubble({ message, isOwn }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (email) => {
    if (!email) return '?'
    return email.substring(0, 2).toUpperCase()
  }

  const getSenderName = (email) => {
    if (!email) return 'Unknown'
    return email.split('@')[0]
  }

  return (
    <div className={`flex items-end gap-2 mb-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>

      {!isOwn && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
          style={{ backgroundColor: '#184e77' }}
        >
          {getInitials(message.user_email)}
        </div>
      )}

      <div className={`max-w-[65%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>

        {!isOwn && (
          <span className="text-xs mb-1 ml-2" style={{ color: '#168aad' }}>
            {getSenderName(message.user_email)}
          </span>
        )}

        <div
          className="px-3 py-2 rounded-lg relative"
          style={{
            backgroundColor: isOwn ? '#1e6091' : 'var(--message-bg)',
            borderRadius: isOwn
              ? '12px 12px 2px 12px'
              : '12px 12px 12px 2px'
          }}
        >
          <p className="text-white text-sm leading-relaxed break-words">
            {message.content}
          </p>

          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs" style={{ color: '#8696a0' }}>
              {formatTime(message.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}