<script lang="ts">
  import { cmsSupabase } from '$lib/cmsSupabase';
  import Nav from '$lib/components/nav.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let password = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';
  let success = false;
  let validSession = false;
  let checking = true;

  onMount(async () => {
    // URL se session check karo
    const { data: { session } } = await cmsSupabase.auth.getSession();
    if (session) {
      validSession = true;
    }
    checking = false;
  });

  async function updatePassword() {
    if (!password.trim()) {
      error = 'Please enter a new password.';
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters.';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match.';
      return;
    }

    loading = true;
    error = '';

    const { error: updateError } = await cmsSupabase.auth.updateUser({
      password: password
    });

    loading = false;

    if (updateError) {
      error = updateError.message;
      return;
    }

    success = true;

    // 3 seconds baad login pe bhejo
    setTimeout(() => goto('/cms/login'), 3000);
  }
</script>

<Nav />

<div class="page">
  <div class="card">
    {#if checking}
      <p style="text-align:center;color:#666;">Loading...</p>

    {:else if success}
      <div class="center">
        <div class="icon">✅</div>
        <h2>Password Updated!</h2>
        <p class="desc">
          Your password has been reset successfully.
          Redirecting to login...
        </p>
      </div>

    {:else if !validSession}
      <div class="center">
        <div class="icon">⚠️</div>
        <h2>Invalid or Expired Link</h2>
        <p class="desc">
          This password reset link is invalid or has expired.
          Please request a new one.
        </p>
        <a href="/cms/forgot" class="btn-link">Request New Link</a>
      </div>

    {:else}
      <h2>Set New Password</h2>
      <p class="desc">Enter your new password below.</p>

      <label>New Password *</label>
      <input
        type="password"
        placeholder="Min 6 characters"
        bind:value={password}
      />

      <label>Confirm Password *</label>
      <input
        type="password"
        placeholder="Repeat your password"
        bind:value={confirmPassword}
        on:keydown={(e) => e.key === 'Enter' && updatePassword()}
      />

      {#if error}
        <p class="error">{error}</p>
      {/if}

      <button class="btn" on:click={updatePassword} disabled={loading}>
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    {/if}
  </div>
</div>

<style>
  .page {
    min-height: calc(100vh - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fb;
    padding: 100px 20px 40px;
  }

  .card {
    width: 100%;
    max-width: 420px;
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }

  .center { text-align: center; }
  .icon { font-size: 48px; margin-bottom: 16px; }

  h2 { margin: 0 0 8px; color: #0d2460; font-size: 24px; font-weight: 800; }

  .desc {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
  }

  input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
    margin-bottom: 16px;
  }

  input:focus { border-color: #0155bd; }

  .btn {
    width: 100%;
    padding: 13px;
    background: #0155bd;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn:hover { background: #0046a8; }
  .btn:disabled { background: #93c5fd; cursor: not-allowed; }

  .error { color: #dc2626; font-size: 13px; margin-bottom: 8px; }

  .btn-link {
    display: inline-block;
    margin-top: 16px;
    padding: 12px 24px;
    background: #0155bd;
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
    font-size: 14px;
  }
</style>