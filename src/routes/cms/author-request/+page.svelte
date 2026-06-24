<script lang="ts">
  import { cmsSupabase } from '$lib/cmsSupabase';
  import Nav from '$lib/components/nav.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // Step management
  let step: 'select' | 'author-form' | 'testimonial-form' | 'submitted' = 'select';
  let selectedRole: 'author' | 'testimonial_writer' | null = null;

  // Author form fields
  let qualification = '';
  let researchArea = '';
  let reason = '';

  // Testimonial form fields
  let tName = '';
  let tDesignation = '';
  let tContent = '';

  let loading = false;
  let message = '';
  let checking = true;

  onMount(async () => {
    const { data: { user } } = await cmsSupabase.auth.getUser();

    if (!user) { goto('/cms/login'); return; }

    const { data: profile } = await cmsSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'author') { goto('/cms/author_dashboard'); return; }
    if (profile?.role === 'testimonial_writer') { goto('/cms/testimonial_dashboard'); return; }

    // Check pending requests
    const { data: existingAuthor } = await cmsSupabase
      .from('author_requests')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingAuthor) { goto('/cms/pending'); return; }

    checking = false;
  });

  async function submitAuthorRequest() {
    if (!qualification.trim() || !researchArea.trim() || !reason.trim()) {
      message = 'Please fill in all fields.';
      return;
    }

    loading = true;
    message = '';

    const { data: { user } } = await cmsSupabase.auth.getUser();
    if (!user) { goto('/cms/login'); return; }

    const { error } = await cmsSupabase.from('author_requests').insert([{
      user_id: user.id,
      qualification: qualification.trim(),
      research_area: researchArea.trim(),
      reason: reason.trim(),
      status: 'pending'
    }]);

    loading = false;

    if (error) { message = error.message; return; }
    step = 'submitted';
  }

  async function submitTestimonialRequest() {
    if (!tName.trim() || !tContent.trim()) {
      message = 'Please fill in all required fields.';
      return;
    }

    loading = true;
    message = '';

    const { data: { user } } = await cmsSupabase.auth.getUser();
    if (!user) { goto('/cms/login'); return; }

    // Author requests table mein testimonial request insert karo
    const { error } = await cmsSupabase.from('author_requests').insert([{
      user_id: user.id,
      qualification: tDesignation.trim() || 'N/A',
      research_area: 'Testimonial',
      reason: `Name: ${tName}\nDesignation: ${tDesignation}\nTestimonial: ${tContent}`,
      status: 'pending'
    }]);

    loading = false;

    if (error) { message = error.message; return; }
    step = 'submitted';
  }
</script>

<Nav />

<div class="page">
  {#if checking}
    <div class="card center">
      <p style="color:#666;">Checking your status...</p>
    </div>

  {:else if step === 'select'}
    <!-- Role Selection -->
    <div class="card">
      <h2>What would you like to do?</h2>
      <p class="desc">Choose the type of access you want to request.</p>

      <div class="role-grid">
        <!-- Author Card -->
        <button
          class="role-card {selectedRole === 'author' ? 'selected' : ''}"
          on:click={() => selectedRole = 'author'}
        >
          <div class="role-icon">✍️</div>
          <h3>Write Articles</h3>
          <p>Submit research articles and blogs for review and publication.</p>
        </button>

        <!-- Testimonial Card -->
        <button
          class="role-card {selectedRole === 'testimonial_writer' ? 'selected' : ''}"
          on:click={() => selectedRole = 'testimonial_writer'}
        >
          <div class="role-icon">💬</div>
          <h3>Share Testimonial</h3>
          <p>Share your experience or feedback with the Jarurat Care community.</p>
        </button>
      </div>

      <button
        class="btn-primary"
        disabled={!selectedRole}
        on:click={() => step = selectedRole === 'author' ? 'author-form' : 'testimonial-form'}
      >
        Continue →
      </button>
    </div>

  {:else if step === 'author-form'}
    <!-- Author Request Form -->
    <div class="card">
      <button class="back-btn" on:click={() => { step = 'select'; message = ''; }}>← Back</button>
      <h2>Request Author Access</h2>
      <p class="desc">Fill in the details below to request author access.</p>

      <label>Qualification *</label>
      <input type="text" placeholder="e.g. MBBS, PhD in Oncology" bind:value={qualification} />

      <label>Research Area *</label>
      <input type="text" placeholder="e.g. Cancer Research, Palliative Care" bind:value={researchArea} />

      <label>Why do you want author access? *</label>
      <textarea rows="5" placeholder="Explain your purpose and what you plan to write about..." bind:value={reason}></textarea>

      {#if message}<p class="error">{message}</p>{/if}

      <button class="btn-primary" on:click={submitAuthorRequest} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>

      <p class="link-text">Already submitted? <a href="/cms/pending">Check status</a></p>
    </div>

  {:else if step === 'testimonial-form'}
    <!-- Testimonial Form -->
    <div class="card">
      <button class="back-btn" on:click={() => { step = 'select'; message = ''; }}>← Back</button>
      <h2>Share Your Testimonial</h2>
      <p class="desc">Share your experience with Jarurat Care. Your testimonial will be reviewed before publishing.</p>

      <label>Your Name *</label>
      <input type="text" placeholder="e.g. Rahul Sharma" bind:value={tName} />

      <label>Designation / Role</label>
      <input type="text" placeholder="e.g. Cancer Survivor, Caregiver, Doctor" bind:value={tDesignation} />

      <label>Your Testimonial *</label>
      <textarea
        rows="6"
        placeholder="Share your experience with Jarurat Care..."
        bind:value={tContent}
      ></textarea>

      {#if message}<p class="error">{message}</p>{/if}

      <button class="btn-primary" on:click={submitTestimonialRequest} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Testimonial'}
      </button>
    </div>

  {:else if step === 'submitted'}
    <!-- Success -->
    <div class="card center">
      <div class="icon">⏳</div>
      <h2>Request Submitted!</h2>
      <p class="desc">
        Your request has been submitted successfully.
        Please wait for admin approval.
      </p>
      <a href="/cms/pending" class="btn-link">View Status →</a>
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
    max-width: 560px;
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }

  .center { text-align: center; }

  .icon { font-size: 48px; margin-bottom: 16px; }

  h2 { margin: 0 0 8px; color: #0d2460; font-size: 24px; font-weight: 800; }

  .desc { color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }

  /* Role Selection */
  .role-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .role-card {
    background: #f8faff;
    border: 2px solid #e8eef7;
    border-radius: 14px;
    padding: 24px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .role-card:hover { border-color: #0155bd; background: #f0f6ff; }
  .role-card.selected { border-color: #0155bd; background: #eff6ff; box-shadow: 0 0 0 3px rgba(1,85,189,0.15); }

  .role-icon { font-size: 36px; }

  .role-card h3 { margin: 0; font-size: 16px; font-weight: 800; color: #0d2460; }
  .role-card p { margin: 0; font-size: 12px; color: #6b7280; line-height: 1.5; }

  /* Form fields */
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

  input:focus, textarea:focus { border-color: #0155bd; }

  /* Buttons */
  .btn-primary {
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

  .btn-primary:hover { background: #0046a8; }
  .btn-primary:disabled { background: #93c5fd; cursor: not-allowed; }

  .back-btn {
    background: none;
    border: none;
    color: #0155bd;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    margin-bottom: 20px;
    display: block;
  }

  .btn-link {
    display: inline-block;
    margin-top: 16px;
    color: #0155bd;
    font-weight: 700;
    text-decoration: none;
    font-size: 15px;
  }

  .error { color: #dc2626; font-size: 13px; margin-top: 12px; }

  .link-text {
    text-align: center;
    margin-top: 16px;
    font-size: 13px;
    color: #6b7280;
  }

  .link-text a { color: #0155bd; text-decoration: none; font-weight: 600; }

  @media (max-width: 480px) {
    .role-grid { grid-template-columns: 1fr; }
    .card { padding: 24px; }
  }
</style>