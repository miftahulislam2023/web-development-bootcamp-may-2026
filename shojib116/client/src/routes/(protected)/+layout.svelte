<script lang="ts">
  import "../layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import * as Sidebar from "$lib/components/ui/sidebar/index";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import AppSidebar from "$lib/components/ui/app-sidebar.svelte";
  import { ModeWatcher } from "mode-watcher";

  let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />
<Tooltip.Provider>
  <Sidebar.Provider>
    <AppSidebar user={data.user} users={data.users} chatList={data.chatList} />
    <main class="w-full">
      <Sidebar.Trigger class="absolute z-10 border bg-accent" />
      {@render children()}
    </main>
  </Sidebar.Provider>
</Tooltip.Provider>
