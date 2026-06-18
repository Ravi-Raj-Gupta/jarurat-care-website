<script lang="ts">
  import { cmsSupabase } from '$lib/cmsSupabase';
  import Nav from '$lib/components/nav.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let qualification = '';
  let researchArea = '';
  let reason = '';
  let loading = false;
  let submitted = false;
  let message = '';
  let checking = true;

  onMount(async () => {
    const { data: { user } } = await cmsSupabase.auth.getUser();

    if (!user) {
      goto('/cms/login');
      return;
    }

    // Already author hai toh redirect karo
    const { data: profile } = await cmsSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'author') {
      goto('/cms/author_dashboard');
      return;
    }

    // Pending request already hai toh pending page pe bhejo
    const { data: existing } = await cmsSupabase
      .from('author_requests')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .maybeSingle();

    if (existing) {
      goto('/cms/pending');
      return;
    }

    checking = false;
  });

  async function submitRequest() {
    if (!qualification.trim() || !researchArea.trim() || !reason.trim()) {
      message = 'Please fill in all fields.';
      return;
    }

    loading = true;
    message = '';

    const { data: { user } } = await cmsSupabase.auth.getUser();

    if (!user) {
      goto('/cms/login');
      return;
    }

    const { error } = await cmsSupabase.from('author_requests').insert([{
      user_id: user.id,
      qualification: qualification.trim(),
      research_area: researchArea.trim(),
      reason: reason.trim(),
      status: 'pending'
    }]);

    loading = false;

    if (error) {
      message = error.message;
      return;
    }

    submitted = true;
  }
</script>

<Nav />

<div class="page">
  {#if checking}
    <div class="card">
      <p style="text-align:center;color:#666;">Checking your status...</p>
    </div>

  {:else if submitted}
    <div class="card text-center">
      <div class="icon">⏳</div>
      <h2>Request Submitted!</h2>
      <p class="desc">
        Your author access request has been submitted successfully.
        Please wait for admin approval. You will be notified once approved.
      </p>
      <a href="/cms/pending" class="btn">View Status</a>
    </div>

  {:else}
    <div class="card">
      <h2>Request Author Access</h2>
      <p class="desc">Fill in the details below to request author access to the CMS.</p>

      <label>Qualification *</label>
      <input
        type="text"
        placeholder="e.g. MBBS, PhD in Oncology"
        bind:value={qualification}
      />

      <label>Research Area *</label>
      <input
        type="text"
        placeholder="e.g. Cancer Research, Palliative Care"
        bind:value={researchArea}
      />

      <label>Why do you want author access? *</label>
      <textarea
        rows="5"
        placeholder="Explain your purpose and what you plan to write about..."
        bind:value={reason}
      ></textarea>

      {#if message}
        <p class="error">{message}</p>
      {/if}

      <button on:click={submitRequest} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>

      <p class="link-text">
        Already submitted? <a href="/cms/pending">Check status</a>
      </p>
    </div>
  {/if}
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
    max-width: 520px;
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }

  .text-center { text-align: center; }

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  h2 {
    margin: 0 0 8px;
    color: #0d2460;
    font-size: 24px;
    font-weight: 800;
  }

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
    margin: 16px 0 6px;
  }

  input, textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  input:focus, textarea:focus {
    border-color: #0155bd;
  }

  button {
    width: 100%;
    margin-top: 20px;
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

  button:hover { background: #0046a8; }
  button:disabled { background: #93c5fd; cursor: not-allowed; }

  .error {
    color: #dc2626;
    font-size: 13px;
    margin-top: 12px;
  }

  .btn {
    display: inline-block;
    margin-top: 20px;
    padding: 12px 24px;
    background: #0155bd;
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
    font-size: 14px;
  }

  .btn:hover { background: #0046a8; }

  .link-text {
    text-align: center;
    margin-top: 16px;
    font-size: 13px;
    color: #6b7280;
  }

  .link-text a {
    color: #0155bd;
    text-decoration: none;
    font-weight: 600;
  }
</style>