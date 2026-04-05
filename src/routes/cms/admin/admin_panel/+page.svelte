<script>
import { onMount } from "svelte";
import { supabase } from "$lib/supabase";
import Nav from "$lib/components/nav.svelte";
let users = [];
let roles = {};

// Load users from Supabase
async function loadUsers() {
  const { data, error } = await supabase
    .from("user")  // <-- singular table name
    .select("*");

  if (error) {
    console.log("Load error:", error);
  } else {
    users = data;
    users.forEach(user => {
      roles[user.email] = user.role;
    });
    console.log("Fetched users:", users);
  }
}

// Save role back to Supabase
async function saveRole(email) {
  const role = roles[email];

  const { error } = await supabase
    .from("user") // <-- singular table name
    .update({ role })
    .eq("email", email);

  if (error) {
    alert("Error saving role");
    console.log(error);
  } else {
    alert("Role updated successfully!");
  }
}

onMount(loadUsers);
</script>
<Nav />

<h2>Admin Panel</h2>

<div class="admin-container">
  <table border="1" class="admin-table">
    <tr>
      <th>Email</th>
      <th>Role</th>
      <th>Action</th>
    </tr>

    {#each users as user}
      <tr>
        <td>{user.email}</td>
        <td>
          <select bind:value={roles[user.email]}>
  <option value="pending">Pending</option>
  <option value="admin">Admin</option>
  <option value="author">Author</option>
  <option value="editor">Editor</option>
</select>
        </td>
        <td>
          <button on:click={() => saveRole(user.email)}>Save</button>
        </td>
      </tr>
    {/each}
  </table>
</div>
<style>
.admin-container {
  max-width: 900px;
  margin: 80px auto 60px; /* top / sides / bottom spacing */
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.admin-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.admin-table th,
.admin-table td {
  padding: 14px 12px;
  text-align: left;
}

.admin-table th {
  background-color: #2f80ed;
  color: white;
  font-weight: 600;
}

.admin-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.admin-table tr:hover {
  background-color: #f1f5fb;
}

.admin-table select {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.admin-table button {
  padding: 6px 12px;
  background-color: #2f80ed;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.admin-table button:hover {
  background-color: #1c6dd0;
}
</style>