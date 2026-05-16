<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import * as Kbd from "$lib/components/ui/kbd/index.js";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { tick } from "svelte";
  import { conn } from "../../websocket.js";
  import clsx from "clsx";

  type Chat = {
    conversation_id: string;
    username: string;
    user_id: string;
  };

  type Envelope = {
    type: "direct";
    from: string;
    to: string;
    text: string;
    sentAt: string;
    conversation_id: string;
  };

  type RecievedMessage = {
    id: string;
    conversation_id: string;
    sender_id: string;
    sent_at: string;
    text: string;
  };

  let chatContainer: HTMLDivElement;
  let showBar = $state(false);

  $effect(() => {
    messages.length;
    tick().then(() => {
      if (chatContainer) {
        showBar = chatContainer.scrollHeight > chatContainer.clientHeight;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  });

  function now() {
    return new Date().toISOString();
  }

  let { data } = $props();
  let user = $derived(data.user);

  let currentChat = $derived(
    () =>
      data.chatList.filter(
        (chat: Chat) => chat.conversation_id === data.chat_id,
      )[0],
  );

  let messages: RecievedMessage[] = $state([]);

  $effect(() => {
    messages = data.messages;
  });

  let message = $state("");

  conn.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    messages.push(...msg);
  };

  const handleSubmit = (e?: SubmitEvent) => {
    if (e) e.preventDefault();

    if (message.trim() === "" || message.length > 256 || !data.chat_id) {
      return;
    }

    console.log(now());

    const env: Envelope = {
      type: "direct",
      from: user.user_id,
      to: currentChat().user_id,
      text: message.trim(),
      conversation_id: data.chat_id,
      sentAt: now(),
    };

    conn.send(JSON.stringify(env));

    message = "";
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };
</script>

{#snippet avatar(username: string, classes: string)}
  <Avatar.Root class={classes}>
    <Avatar.Image src={`https://github.com/${username}.png`} alt={username} />
    <Avatar.Fallback>{username[0].toUpperCase()}</Avatar.Fallback>
  </Avatar.Root>
{/snippet}

{#snippet messageBlock(text: string, username: string, currentUser?: boolean)}
  <div
    class={clsx("flex flex-row gap-2 items-center max-w-4/5", {
      "flex-row-reverse": currentUser,
    })}
  >
    {@render avatar(username, "w-8 h-8")}
    <p>{text}</p>
  </div>
{/snippet}

<div class="relative h-dvh max-w-xl mx-auto overflow-hidden">
  {#if showBar}
    <div
      class="absolute top-0 left-0 right-0 z-10 flex items-center justify-center flex-col gap-2 border-b bg-background/80 backdrop-blur-sm px-4 py-2"
    >
      {@render avatar(currentChat()?.username, "w-10 h-10")}
      <span class="text-sm font-medium">{currentChat()?.username}</span>
    </div>
  {/if}

  <div
    bind:this={chatContainer}
    class="absolute no-scrollbar inset-0 overflow-y-auto px-4 pb-24"
  >
    <div class="min-h-full flex flex-col justify-end">
      <div class="w-full mb-20">
        <div
          class="w-full flex justify-center -space-x-10 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-2"
        >
          {@render avatar(user.username, "w-20 h-20")}
          {@render avatar(currentChat()?.username, "w-20 h-20")}
        </div>

        <h1 class="text-center">
          This is the start of your conversation with
          <span class="font-bold">{currentChat()?.username}</span>
        </h1>
      </div>

      <div class="space-y-4">
        {#each messages as message}
          {#if message.sender_id === user.user_id}
            <div class="flex justify-end">
              {@render messageBlock(message.text, user.username, true)}
            </div>
          {:else}
            <div class="">
              {@render messageBlock(message.text, currentChat().username)}
            </div>
          {/if}
        {/each}
      </div>
    </div>
  </div>

  <form
    onsubmit={handleSubmit}
    class="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-background p-4"
  >
    <Textarea
      rows={1}
      class="resize-none"
      bind:value={message}
      onkeydown={handleKeydown}
    />

    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button type="submit">Send</Button>
      </Tooltip.Trigger>
      <Tooltip.Content
        ><Kbd.Root>Ctrl</Kbd.Root> + <Kbd.Root>⏎</Kbd.Root></Tooltip.Content
      >
    </Tooltip.Root>
  </form>
</div>
