<script lang="ts">
  let msg = $state("");
  const messages: string[] = $state([]);

  const conn = new WebSocket(import.meta.env.VITE_WS_URL);
  conn.onclose = () => {
    messages.push("Connection closed");
  };

  conn.onmessage = (e) => {
    console.log(e.data);
    messages.push(e.data);
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    conn.send(msg);
    msg = "";
  };
</script>

<div id="messages">
  {#each messages as message}
    <p>{message}</p>
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
