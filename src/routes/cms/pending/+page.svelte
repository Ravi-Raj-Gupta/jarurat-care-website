<script lang="ts">
  import Nav from '$lib/components/nav.svelte';
  import { fly, fade } from 'svelte/transition';
  import { cmsSupabase } from '$lib/cmsSupabase';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let requestStatus = 'pending';
  let loading = true;

  onMount(async () => {
    const { data: { user } } = await cmsSupabase.auth.getUser();

    if (!user) {
      goto('/cms/login');
      return;
    }

    // Profile role check karo
    const { data: profile } = await cmsSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Agar already author ban gaya toh redirect karo
    if (profile?.role === 'author') {
      goto('/cms/author_dashboard');
      return;
    }

    // Author request ka status check karo
    const { data: request } = await cmsSupabase
      .from('author_requests')
      .select('status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    requestStatus = request?.status || 'pending';
    loading = false;
  });
</script>

<Nav />

<div class="page">
  {#if loading}
    <div class="card">
      <p style="color:#666;">Checking your status...</p>
    </div>
  {:else}
    <div class="card" in:fly={{ y: 50, duration: 500 }}>

      {#if requestStatus === 'rejected'}
        <!-- Rejected state -->
        <div class="status-icon rejected"></div>
        <h1>Request Rejected</h1>
        <p class="desc">
          Unfortunately, your author access request was rejected.
          You can submit a new request with updated details.
        </p>
        <a href="/cms/author-request" class="btn">Submit New Request</a>

      {:else if requestStatus === 'approved'}
        <!-- Approved — redirect hoga author_dashboard pe -->
        <div class="status-icon approved"></div>
        <h1>Request Approved!</h1>
        <p class="desc">Your author access has been approved. Redirecting...</p>

      {:else}
        <!-- Pending state -->
        <div class="status-icon"></div>
        <h1>Waiting for Admin Approval</h1>
        <p class="desc">
          Your account has been created successfully.<br />
          Access to the CMS will be enabled once an administrator reviews
          and assigns your role.
        </p>

        <div class="loading" in:fade>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="info-box">
          <p>
            If your approval is taking longer than expected, please contact
            the administrator for assistance.
          </p>
        </div>
      {/if}

    </div>
  {/if}
</div>

<style>
.page {
  margin-top: 40px;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fb, #eef2ff);
  padding: 40px 20px;
}

.card {
  max-width: 600px;
  background: white;
  padding: 45px;
  border-radius: 14px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.08);
  text-align: center;
}

.status-icon {
  width: 60px;
  height: 60px;
  margin: auto;
  border-radius: 50%;
  background: #2f80ed;
  margin-bottom: 20px;
  position: relative;
}

.status-icon.rejected { background: #e74c3c; }
.status-icon.approved { background: #27ae60; }

.status-icon::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h1 { margin-bottom: 12px; color: #2c3e50; }

.desc {
  color: #666;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 25px;
}

.loading {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 25px;
}

.loading span {
  width: 8px;
  height: 8px;
  background: #2f80ed;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}

.loading span:nth-child(2) { animation-delay: 0.2s; }
.loading span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.info-box {
  background: #f8f9fc;
  padding: 18px;
  border-radius: 8px;
  font-size: 14px;
  color: #555;
}

.btn {
  display: inline-block;
  margin-top: 15px;
  padding: 12px 25px;
  background: #2f80ed;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
}

.btn:hover { background: #1c6dd0; }
</style>