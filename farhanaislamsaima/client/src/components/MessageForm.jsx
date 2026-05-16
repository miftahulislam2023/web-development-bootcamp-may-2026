import { useState } from 'react';
import apiClient from '../api/apiClient';

function ImageIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M4 7a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 15l2.5-2.5L13 15l2-2 3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M9 9h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M21 3L10 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M21 3l-7 18-4-7-7-4 18-7z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

const emojis = [
  '\u{1F600}',
  '\u{1F602}',
  '\u{1F60D}',
  '\u{1F60E}',
  '\u{1F64C}',
  '\u{1F525}',
  '\u{2764}\u{FE0F}',
  '\u{1F44D}'
];

function MessageForm({ disabled, onSend, onTyping, onStopTyping }) {
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [text, setText] = useState('');
  const [typingTimer, setTypingTimer] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (isUploading || (text.trim() === '' && !imagePreview)) {
      return;
    }

    onSend({
      text,
      imageUrl: imagePreview
    });
    setText('');
    setImagePreview('');
    onStopTyping();
  }

  function handleTextChange(e) {
    setText(e.target.value);
    onTyping();

    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    setTypingTimer(setTimeout(onStopTyping, 1000));
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image smaller than 2MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploading(true);
      const res = await apiClient.post('/uploads/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImagePreview(res.data.imageUrl);
      e.target.value = '';
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || 'Could not upload image.');
    } finally {
      setIsUploading(false);
    }
  }

  function addEmoji(emoji) {
    setText((oldText) => `${oldText}${emoji}`);
    onTyping();
  }

  return (
    <form
      className="grid gap-2 border-t border-[#d7dde4] bg-[#f7f8fa] p-3"
      onSubmit={handleSubmit}
    >
      {imagePreview && (
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3 rounded-lg border border-[#d7dde4] bg-white p-2">
          <img
            alt="Selected upload"
            className="h-16 w-16 rounded-md object-cover"
            src={imagePreview}
          />
          <button
            className="btn btn-ghost btn-sm rounded-md text-[#64748b]"
            type="button"
            onClick={() => setImagePreview('')}
          >
            Remove
          </button>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-4xl flex-wrap gap-1">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            className="btn btn-ghost btn-sm h-8 min-h-8 rounded-full px-2 text-base hover:bg-[#e2e8f0]"
            disabled={disabled}
            type="button"
            onClick={() => addEmoji(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-4xl gap-2">
        <label className="btn h-11 min-h-11 rounded-full border-[#d7dde4] bg-white px-4 text-[#475569] hover:bg-[#edf1f5]" title="Attach image">
          <ImageIcon />
          <input
            accept="image/*"
            className="hidden"
            disabled={disabled || isUploading}
            type="file"
            onChange={handleImageChange}
          />
        </label>

        <input
          disabled={disabled}
          className="input h-11 min-w-0 flex-1 rounded-full border border-[#d7dde4] bg-white px-5 text-[#111827] placeholder:text-[#94a3b8] focus:border-[#2aabee]"
          value={text}
          onChange={handleTextChange}
          placeholder="Write a message"
        />
        <button className="btn h-11 min-h-11 rounded-full border-[#2aabee] bg-[#2aabee] px-5 text-white hover:bg-[#229bd8]" disabled={disabled || isUploading} title="Send message" type="submit">
          <SendIcon />
          <span className="hidden sm:inline">{isUploading ? 'Uploading' : 'Send'}</span>
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
