<script lang="ts">
  import "../layout.css";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { goto } from "$app/navigation";

  let base_url = import.meta.env.VITE_SERVER_BASE_URL;

  let username = $state("");
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (username.trim() === "") {
      return;
    }

    const res = await fetch(`${base_url}/signin`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    console.log(res);
    if (res.ok) {
      return goto("/");
    }
  };
</script>

<div class="w-full">
  <form onsubmit={handleSubmit} class="mx-auto w-sm mt-30">
    <Field.Group>
      <Field.Set>
        <Field.Legend>Sign In</Field.Legend>
        <Field.Field>
          <Field.Label for="username">Username:</Field.Label>
          <Input
            id="username"
            bind:value={username}
            placeholder="johndoe"
            required
          />
        </Field.Field>
        <Field.Field orientation="horizontal">
          <Button type="submit" disabled={username.trim() === ""}>Submit</Button
          >
        </Field.Field>
      </Field.Set>
    </Field.Group>
  </form>
</div>
