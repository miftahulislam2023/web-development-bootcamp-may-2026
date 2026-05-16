<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as Avatar from "$lib/components/ui/avatar/index";
  import * as Menubar from "$lib/components/ui/menubar/index";
  import {
    ChevronsUpDownIcon,
    LogOutIcon,
    SunIcon,
    MoonIcon,
  } from "@lucide/svelte";
  import { signout } from "$lib/api/auth";
  import { goto } from "$app/navigation";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index";
  import ChatTab from "./chat-tab.svelte";

  let { user, users, chatList } = $props();
  const handleSignout = () => {
    signout(user.userID);
    goto("/signin");
  };
</script>

<Sidebar.Root>
  <Sidebar.Header>
    <Button onclick={toggleMode}>
      <span class="flex items-center gap-2 dark:hidden">
        <MoonIcon class="h-4 w-4" />
        Dark
      </span>

      <span class="hidden items-center gap-2 dark:flex">
        <SunIcon class="h-4 w-4" />
        Light
      </span>

      <span class="sr-only">Toggle theme</span>
    </Button>
  </Sidebar.Header>
  <Sidebar.Content>
    <ChatTab {users} {chatList} />
  </Sidebar.Content>
  <Sidebar.Footer>
    <Menubar.Root class="border-0">
      <Menubar.Menu>
        <Menubar.Trigger class="w-full justify-between">
          <div class="flex gap-4 items-center">
            <Avatar.Root>
              <Avatar.Image
                src={`https://github.com/${user.username}.png`}
                alt={`@${user.username}`}
              />
              <Avatar.Fallback>CN</Avatar.Fallback>
            </Avatar.Root>
            <span>{user.username} </span>
          </div>
          <ChevronsUpDownIcon size={16} />
        </Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item onclick={handleSignout}>
            <LogOutIcon /> Logout
          </Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  </Sidebar.Footer>
</Sidebar.Root>
