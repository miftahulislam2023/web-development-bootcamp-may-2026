import { useState } from 'react';

function ConversationPanel({
  conversations,
  users,
  currentUser,
  selectedConversation,
  onSelectConversation,
  onCreateConversation
}) {
  const [groupName, setGroupName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const otherUsers = users.filter((user) => user.id !== currentUser.id);
  const initials = currentUser.name.slice(0, 1).toUpperCase();
  const searchValue = searchText.trim().toLowerCase();
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchValue) {
      return true;
    }

    return (
      conversation.name.toLowerCase().includes(searchValue) ||
      conversation.type.toLowerCase().includes(searchValue) ||
      conversation.participants?.some((participant) => (
        participant.name.toLowerCase().includes(searchValue) ||
        participant.email.toLowerCase().includes(searchValue)
      ))
    );
  });
  const filteredUsers = otherUsers.filter((user) => {
    if (!searchValue) {
      return true;
    }

    return (
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)
    );
  });

  function toggleUser(userId) {
    setSelectedUserIds((oldIds) => (
      oldIds.includes(userId)
        ? oldIds.filter((id) => id !== userId)
        : [...oldIds, userId]
    ));
  }

  function createDirectChat(userId) {
    onCreateConversation({
      type: 'direct',
      participantIds: [userId]
    });
  }

  function createGroupChat(e) {
    e.preventDefault();

    onCreateConversation({
      type: 'group',
      name: groupName,
      participantIds: selectedUserIds
    });

    setGroupName('');
    setSelectedUserIds([]);
  }

  return (
    <aside className="flex min-h-0 flex-col border-r border-[#cbd5e1] bg-[#f6f8fb]">
      <div className="flex h-20 items-center gap-3 bg-[#17212b] px-5 text-white">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2aabee] text-base font-semibold text-white shadow-sm ring-2 ring-white/10">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-5">{currentUser.name}</p>
          <p className="mt-0.5 truncate text-xs leading-4 text-[#b6c2cf]">
            {currentUser.email}
          </p>
        </div>
      </div>

      <div className="border-b border-[#d7dde4] p-3">
        <input
          className="input h-10 w-full rounded-md border border-[#d7dde4] bg-white px-3 text-sm text-[#111827] placeholder:text-[#94a3b8]"
          placeholder="Search or start a chat"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <section className="min-h-0 flex-1 overflow-y-auto">
        <div className="px-3 pb-2 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
            Messages
          </h2>
        </div>

        <div className="grid gap-0.5 px-2">
          {filteredConversations.length === 0 && (
            <p className="px-2 py-3 text-sm text-[#64748b]">
              {searchValue ? 'No matching chats.' : 'No chats yet.'}
            </p>
          )}

          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left transition ${
                selectedConversation?.id === conversation.id
                  ? 'bg-[#d8eefb] shadow-sm'
                  : 'hover:bg-[#edf1f5]'
              }`}
              type="button"
              onClick={() => onSelectConversation(conversation)}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2aabee] text-sm font-semibold text-white">
                {conversation.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-[#111827]">
                  {conversation.name}
                </span>
                <span className="text-xs text-[#64748b]">
                  {conversation.type === 'group' ? 'Group chat' : 'Direct chat'}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="border-t border-[#d7dde4] bg-white">
        <div className="px-4 pb-2 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
            People
          </h2>
        </div>

        <div className="grid max-h-44 gap-0.5 overflow-y-auto px-2 pb-3">
          {filteredUsers.length === 0 && (
            <p className="px-3 py-2 text-sm text-[#64748b]">
              {searchValue ? 'No matching people.' : 'No people found.'}
            </p>
          )}

          {filteredUsers.map((user) => (
            <button
              key={user.id}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-left transition hover:bg-[#edf1f5]"
              type="button"
              onClick={() => createDirectChat(user.id)}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e2e8f0] text-xs font-semibold text-[#475569]">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-[#111827]">{user.name}</span>
                <span className="block truncate text-xs text-[#64748b]">{user.email}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="border-t border-[#d7dde4] bg-white">
        <div className="px-4 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
            New Group
          </h2>
        </div>

        <form className="grid gap-3 p-4 pt-3" onSubmit={createGroupChat}>
          <input
            className="input h-10 w-full rounded-md border border-[#d7dde4] bg-white text-sm text-[#111827]"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
          />

          <div className="grid max-h-28 gap-0.5 overflow-y-auto">
            {otherUsers.map((user) => (
              <label
                key={user.id}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[#334155] hover:bg-[#f1f5f9]"
              >
                <input
                  className="checkbox checkbox-sm"
                  type="checkbox"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                />
                <span>{user.name}</span>
              </label>
            ))}
          </div>

          <button className="btn btn-sm rounded-md border-[#2aabee] bg-[#2aabee] text-white hover:bg-[#229bd8]" type="submit">
            Create Group
          </button>
        </form>
      </section>
    </aside>
  );
}

export default ConversationPanel;
