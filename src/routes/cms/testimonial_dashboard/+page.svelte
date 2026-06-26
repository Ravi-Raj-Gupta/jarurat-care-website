<script lang="ts">
  import { onMount } from 'svelte';
  import { cmsSupabase } from '$lib/cmsSupabase';
  import { goto } from '$app/navigation';
  import Nav from '$lib/components/nav.svelte';
 
  type Testimonial = {
    id: string;
    name: string;
    designation: string | null;
    content: string;
    status: string;
    admin_feedback?: string | null;
    created_at: string;
  };
 
  let user: any = null;
  let testimonials: Testimonial[] = [];
  let loading = true;
  let showForm = false;
  let submitting = false;
  let message = '';
  let editingTestimonial: Testimonial | null = null;
 
  let name = '';
  let designation = '';
  let content = '';
 
  onMount(async () => {
    const { data: { user: u } } = await cmsSupabase.auth.getUser();
    if (!u) { goto('/cms/login'); return; }
 
    const { data: profile } = await cmsSupabase
      .from('profiles')
      .select('role')
      .eq('id', u.id)
      .single();
 
    if (profile?.role !== 'testimonial_writer') {
      goto('/cms/pending');
      return;
    }
 
    user = u;
    await loadTestimonials();
  });
 
  async function loadTestimonials() {
    loading = true;
    const { data } = await cmsSupabase
      .from('testimonials')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
 
    testimonials = data ?? [];
    loading = false;
  }
 
  function canEdit(status: string) {
    return status === 'submitted' || status === 'changes_requested';
  }
 
  function startEdit(t: Testimonial) {
    editingTestimonial = t;
    name = t.name;
    designation = t.designation ?? '';
    content = t.content;
    message = '';
    showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  function resetForm() {
    editingTestimonial = null;
    name = '';
    designation = '';
    content = '';
    message = '';
    showForm = false;
  }
 
  function toggleForm() {
    if (showForm) {
      resetForm();
    } else {
      editingTestimonial = null;
      name = '';
      designation = '';
      content = '';
      message = '';
      showForm = true;
    }
  }
 
  async function submitTestimonial() {
    if (!name.trim() || !content.trim()) {
      message = 'Name and testimonial are required.';
      return;
    }
 
    submitting = true;
    message = '';
 
    if (editingTestimonial) {
      const { error } = await cmsSupabase
        .from('testimonials')
        .update({
          name: name.trim(),
          designation: designation.trim() || null,
          content: content.trim(),
          status: 'submitted',
          admin_feedback: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTestimonial.id);
 
      submitting = false;
 
      if (error) { message = error.message; return; }
 
      message = '✅ Testimonial updated and resubmitted for review!';
      resetForm();
      await loadTestimonials();
      return;
    }
 
    const { error } = await cmsSupabase.from('testimonials').insert([{
      user_id: user.id,
      name: name.trim(),
      designation: designation.trim() || null,
      content: content.trim(),
      status: 'submitted'
    }]);
 
    submitting = false;
 
    if (error) { message = error.message; return; }
 
    message = '✅ Testimonial submitted for review!';
    resetForm();
    await loadTestimonials();
  }
 
  async function logout() {
    goto('/');
    cmsSupabase.auth.signOut();
  }
 
  function getStatusColor(status: string) {
    switch (status) {
      case 'submitted': return { bg: '#dbeafe', color: '#1d4ed8' };
      case 'published': return { bg: '#dcfce7', color: '#166534' };
      case 'rejected': return { bg: '#fee2e2', color: '#991b1b' };
      case 'changes_requested': return { bg: '#fef3c7', color: '#92400e' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  }
 
  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
</script>
 
<Nav />
 
<div class="dashboard">
  <div class="topbar">
    <div>
      <h1>Testimonial Dashboard</h1>
      <p class="welcome">Welcome, {user?.email?.split('@')[0] || '...'}</p>
    </div>
    <button class="btn-logout" on:click={logout}>Logout</button>
  </div>
 
  <!-- Stats -->
  <div class="stats-grid">
    <div class="stat-card" style="border-top-color:#3b82f6;">
      <p class="stat-label">Submitted</p>
      <p class="stat-num">{testimonials.filter(t => t.status === 'submitted').length}</p>
    </div>
    <div class="stat-card" style="border-top-color:#22c55e;">
      <p class="stat-label">Published</p>
      <p class="stat-num">{testimonials.filter(t => t.status === 'published').length}</p>
    </div>
    <div class="stat-card" style="border-top-color:#ef4444;">
      <p class="stat-label">Rejected</p>
      <p class="stat-num">{testimonials.filter(t => t.status === 'rejected').length}</p>
    </div>
  </div>
 
  <!-- New Testimonial Button -->
  <button class="btn-new" on:click={toggleForm}>
    {showForm ? '✕ Cancel' : '+ Add Testimonial'}
  </button>
 
  <!-- Form -->
  {#if showForm}
    <div class="card form-card">
      <h3>{editingTestimonial ? 'Edit Your Testimonial' : 'Share Your Testimonial'}</h3>
 
      <label>Your Name *</label>
      <input type="text" placeholder="e.g. Rahul Sharma" bind:value={name} />
 
      <label>Designation / Role</label>
      <input type="text" placeholder="e.g. Cancer Survivor, Caregiver" bind:value={designation} />
 
      <label>Your Testimonial *</label>
      <textarea rows="6" placeholder="Share your experience with Jarurat Care..." bind:value={content}></textarea>
 
      {#if message}
        <p class="msg">{message}</p>
      {/if}
 
      <button class="btn-submit" on:click={submitTestimonial} disabled={submitting}>
        {submitting ? (editingTestimonial ? 'Updating...' : 'Submitting...') : (editingTestimonial ? 'Update Testimonial' : 'Submit Testimonial')}
      </button>
    </div>
  {/if}
 
  <!-- Testimonials List -->
  <h3 class="section-title">My Testimonials</h3>
 
  {#if loading}
    <div class="card empty">Loading...</div>
  {:else if testimonials.length === 0}
    <div class="card empty">
      <p>No testimonials yet.</p>
      <button class="btn-new" on:click={() => { editingTestimonial = null; showForm = true; }}>Add your first testimonial</button>
    </div>
  {:else}
    <div class="testimonials-grid">
      {#each testimonials as t}
        {@const sc = getStatusColor(t.status)}
        <div class="card testimonial-card">
          <div class="t-header">
            <div>
              <h4>{t.name}</h4>
              {#if t.designation}
                <p class="t-designation">{t.designation}</p>
              {/if}
            </div>
            <span class="t-status" style="background:{sc.bg};color:{sc.color};">
              {t.status.replace('_', ' ')}
            </span>
          </div>
          <p class="t-content">"{t.content}"</p>
 
          {#if t.status === 'changes_requested' && t.admin_feedback}
            <div class="t-feedback">
              <strong>Admin feedback:</strong> {t.admin_feedback}
            </div>
          {/if}
 
          <div class="t-footer">
            <p class="t-date">{formatDate(t.created_at)}</p>
            {#if canEdit(t.status)}
              <button class="btn-edit" on:click={() => startEdit(t)}>Edit</button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
 
<style>
  .dashboard {
    padding: 100px 40px 40px;
    background: #f4f9ff;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
  }
 
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
  }
 
  h1 { font-size: 28px; font-weight: 900; color: #0d2460; margin: 0; }
  .welcome { color: #5b6780; margin-top: 4px; }
 
  .btn-logout {
    background: #f1f5f9;
    color: #374151;
    padding: 10px 16px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    font-weight: 600;
  }
 
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
 
  .stat-card {
    background: white;
    border-radius: 14px;
    padding: 20px;
    border: 1px solid #e8eef7;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    border-top: 4px solid #94a3b8;
  }
 
  .stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #6b7280; margin: 0 0 8px; }
  .stat-num { font-size: 32px; font-weight: 900; color: #0d2460; margin: 0; }
 
  .btn-new {
    background: #0155bd;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 20px;
  }
 
  .card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid #e8eef7;
  }
 
  .form-card { margin-bottom: 24px; }
  .form-card h3 { color: #0d2460; margin: 0 0 16px; }
 
  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin: 12px 0 4px;
  }
 
  input, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #d9e3f0;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
  }
 
  input:focus, textarea:focus { border-color: #0155bd; }
 
  .msg { color: #167a33; font-weight: 700; margin-top: 10px; }
 
  .btn-submit {
    background: #0155bd;
    color: white;
    padding: 12px 24px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 700;
    margin-top: 14px;
    width: 100%;
  }
 
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
 
  .section-title { color: #0d2460; font-size: 20px; margin: 0 0 16px; }
 
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }
 
  .testimonial-card { padding: 20px; }
 
  .t-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }
 
  .t-header h4 { margin: 0; color: #0d2460; font-size: 16px; }
  .t-designation { margin: 4px 0 0; color: #6b7280; font-size: 13px; }
 
  .t-status {
    font-size: 10px;
    padding: 4px 10px;
    border-radius: 999px;
    font-weight: 800;
    text-transform: uppercase;
    white-space: nowrap;
  }
 
  .t-content {
    color: #374151;
    font-size: 14px;
    line-height: 1.7;
    font-style: italic;
    margin: 0 0 10px;
  }
 
  .t-feedback {
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13px;
    color: #92400e;
    margin: 0 0 10px;
    line-height: 1.5;
  }
 
  .t-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
 
  .t-date { color: #94a3b8; font-size: 12px; margin: 0; }
 
  .btn-edit {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s;
  }
 
  .btn-edit:hover {
    background: #dbeafe;
  }
 
  .empty { text-align: center; padding: 40px; color: #6b7280; }
 
  @media (max-width: 768px) {
    .dashboard { padding: 80px 16px 24px; }
    .stats-grid { grid-template-columns: repeat(3, 1fr); }
    .topbar { flex-direction: column; align-items: flex-start; gap: 12px; }
  }
</style>