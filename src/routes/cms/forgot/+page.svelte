<script lang="ts">
  import { cmsSupabase } from '$lib/cmsSupabase';
  import Nav from '$lib/components/nav.svelte';
  import { goto } from '$app/navigation';
  import toast from 'svelte-french-toast';

  let email = '';
  let loading = false;
  let sent = false;
  let error = '';

  async function sendReset() {
    if (!email.trim()) {
      error = 'Please enter your email address.';
      return;
    }

    loading = true;
    error = '';

    const { error: resetError } = await cmsSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/cms/reset-password`
    });

    loading = false;

    if (resetError) {
      error = resetError.message;
      return;
    }

    sent = true;
    toast.success('Email sent successfully!');
  }
</script>

<Nav />

<div class="page">
  <div class="card">
    {#if sent}
      <div class="center">
        <div class="icon">📧</div>
        <h2>Check Your Email</h2>
        <p class="desc">
          We've sent a password reset link to <strong>{email}</strong>.
          Please check your inbox and follow the instructions.
        </p>
        <p class="desc" style="font-size:13px;color:#94a3b8;">
          Didn't receive it? Check your spam folder.
        </p>
        <button class="btn" on:click={() => { sent = false; email = ''; }}>
          Try Again
        </button>
        <a href="/cms/login" class="back-link">← Back to Login</a>
      </div>

    {:else}
      <h2>Forgot Password?</h2>
      <p class="desc">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <span class="input-label">Email Address *</span>
      <input
        type="email"
        placeholder="Enter your email"
        bind:value={email}
        on:keydown={(e) => e.key === 'Enter' && sendReset()}
      />

      {#if error}
        <p class="error">{error}</p>
      {/if}

      <button class="btn" on:click={sendReset} disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <a href="/cms/login" class="back-link">← Back to Login</a>
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

  .input-label {
    display: block;
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: #475569;
    margin-bottom: 6px;
    letter-spacing: 0.05em;
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
    margin-top: 4px;
  }

  .btn:hover { background: #0046a8; }
  .btn:disabled { background: #93c5fd; cursor: not-allowed; }

  .error { color: #dc2626; font-size: 13px; margin-bottom: 8px; }

  .back-link {
    display: block;
    text-align: center;
    margin-top: 16px;
    color: #0155bd;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
  }

  .back-link:hover { text-decoration: underline; }
</style>