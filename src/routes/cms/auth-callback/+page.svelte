<script lang="ts">
  import { onMount } from 'svelte';
  import { cmsSupabase } from '$lib/cmsSupabase';
  import { goto } from '$app/navigation';

  onMount(async () => {
    const { data: { user } } = await cmsSupabase.auth.getUser();

    if (!user) {
      goto('/cms/login');
      return;
    }

    const { data: profile } = await cmsSupabase
      .from('profiles')
      .select('role, profile_completed, verification_status')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      await cmsSupabase.from('profiles').insert([{
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        role: 'Reader',
        profile_completed: false
      }]);
      goto('/cms/complete-profile');
      return;
    }

    const { role, verification_status, profile_completed } = profile;
    
    // Super Admins and Admins bypass profile completion
    if (role === 'Super_Admin') {
      goto('/cms/super-admin');
      return;
    } else if (role === 'Admin') {
      goto('/cms/admin');
      return;
    }

    if (!profile_completed) {
      goto('/cms/complete-profile');
      return;
    }

    if (role === 'Doctor') {
      if (verification_status === 'approved') {
        goto('/cms/doctor-dashboard');
      } else {
        goto('/cms/pending');
      }
    } else if (role === 'Reader') {
      goto('/cms/reader-dashboard');
    } else {
      goto('/');
    }
  });
</script>

<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f7fb;">
  <div style="text-align:center;">
    <p style="font-size:18px;color:#0d2460;font-weight:700;">Setting up your account...</p>
    <p style="color:#6b7280;margin-top:8px;">Please wait</p>
  </div>
</div>