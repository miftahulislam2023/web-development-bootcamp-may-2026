<script lang="ts">
  import "../layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import * as Sidebar from "$lib/components/ui/sidebar/index";
  import AppSidebar from "$lib/components/ui/app-sidebar.svelte";
  import { ModeWatcher } from "mode-watcher";

  let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />
<Sidebar.Provider>
  <AppSidebar user={data.user} users={data.users} />
  <main>
    <Sidebar.Trigger />
    {@render children()}
  </main>
</Sidebar.Provider>
