<script lang="ts">
  type Message = {
    text: string;
    sentAt?: string;
  };
  let msg = $state("");
  const messages: Message[] = $state([]);

  const conn = new WebSocket(import.meta.env.VITE_SERVER_BASE_URL + "/ws");
  conn.onclose = () => {
    messages.push({ text: "Connection closed" });
  };

  conn.onmessage = (e) => {
    const msgs = JSON.parse(e.data);
    console.log(JSON.parse(e.data));
    messages.push(...msgs);
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    conn.send(msg);
    msg = "";
  };
</script>

<div id="messages">
  {#each messages as message}
    <p>{message.text}</p>
  {/each}
</div>
<form onsubmit={handleSubmit}>
  <input
    type="text"
    bind:value={msg}
    maxlength="256"
    name="message"
    id="message"
  />
  <button type="submit" disabled={msg.trim() === ""}>Send</button>
</form>
