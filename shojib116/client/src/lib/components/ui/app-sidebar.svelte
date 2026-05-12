<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as Avatar from "$lib/components/ui/avatar/index";
  import * as Menubar from "$lib/components/ui/menubar/index";
  import { ChevronsUpDownIcon, LogOutIcon } from "@lucide/svelte";
  import { signout } from "$lib/api/auth";
  import { goto } from "$app/navigation";

  let { user } = $props();
  const handleSignout = () => {
    signout(user.userID);
    goto("/signin");
  };
</script>

<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Content>
    <Sidebar.Group />
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer>
    <Menubar.Root class="border-0">
      <Menubar.Menu>
        <Menubar.Trigger class="w-full justify-between">
          <div class="flex gap-4 items-center">
            <Avatar.Root>
              <Avatar.Image
                src="https://github.com/user.png"
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
