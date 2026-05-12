<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index";
  import * as Avatar from "$lib/components/ui/avatar/index";

  let { user, users } = $props();
</script>

<Tabs.Root value="chats">
  <Tabs.List class="w-full">
    <Tabs.Trigger value="chats">Chats</Tabs.Trigger>
    <Tabs.Trigger value="users">Users</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="users">
    <ul class="space-y-4 mx-2">
      {#each users as user}
        <li class="flex items-center gap-4">
          <Avatar.Root>
            <Avatar.Image
              src="https://github.com/user.png"
              alt={user.username}
            />
            <Avatar.Fallback>U</Avatar.Fallback>
          </Avatar.Root>
          {user.username}
        </li>
      {/each}
    </ul>
  </Tabs.Content>
</Tabs.Root>
