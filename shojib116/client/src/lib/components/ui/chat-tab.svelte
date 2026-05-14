<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index";
  import * as Avatar from "$lib/components/ui/avatar/index";
  import { UserRoundPlusIcon } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index";
  import { addFriend } from "$lib/api/auth";
  import { goto, invalidateAll } from "$app/navigation";
  import { page } from "$app/state";

  let { users, chatList } = $props();

  const handleAddFriend = async (userId: string) => {
    const res = await addFriend(userId);
    if (!res.ok) {
      console.log("creating conversation failed");
    }

    const conv = await res.json();

    await invalidateAll();
    goto(`/chats/${conv.id}`);
  };
</script>

<Tabs.Root value="chats">
  <Tabs.List class="w-full">
    <Tabs.Trigger value="chats">Chats</Tabs.Trigger>
    <Tabs.Trigger value="users">Users</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="chats">
    <ul class="space-y-4 mx-2">
      {#if chatList.length === 0}
        <li>get some friends buddy</li>
      {:else}
        {#each chatList as chat}
          <li>
            <a
              href={`/chats/${chat.conversation_id}`}
              class={`flex justify-between items-center p-2 transition-colors ${
                page.params.chat_id === chat.conversation_id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <div class="flex items-center gap-4">
                <Avatar.Root>
                  <Avatar.Image
                    src={`https://github.com/${chat.username}.png`}
                    alt={chat.username}
                  />
                  <Avatar.Fallback>U</Avatar.Fallback>
                </Avatar.Root>
                {chat.username}
              </div>
            </a>
          </li>
        {/each}
      {/if}
    </ul>
  </Tabs.Content>

  <Tabs.Content value="users">
    <ul class="space-y-4 mx-2">
      {#each users as user}
        <li class="flex justify-between items-center hover:bg-accent p-1">
          <div class="flex items-center gap-4">
            <Avatar.Root>
              <Avatar.Image
                src={`https://github.com/${user.username}.png`}
                alt={user.username}
              />
              <Avatar.Fallback>U</Avatar.Fallback>
            </Avatar.Root>
            {user.username}
          </div>
          {#if !user.is_friend}
            <Button
              variant="outline"
              onclick={() => handleAddFriend(user.id)}
              size="icon"
              class="hover:cursor-pointer"
            >
              <UserRoundPlusIcon size={16} />
            </Button>
          {/if}
        </li>
      {/each}
    </ul>
  </Tabs.Content>
</Tabs.Root>
