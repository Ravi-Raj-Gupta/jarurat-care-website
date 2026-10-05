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
      .select('role, profile_completed, verification_status, is_reviewer')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      const { error: insertError } = await cmsSupabase.from('profiles').upsert([{
        id: user.id,
        email: user.email,
        full_name: fallbackName,
        role: 'Reader',
        profile_completed: false,
        verification_status: 'approved'
      }], { onConflict: 'id' });
      if (insertError) console.error('Google profile bootstrap error:', insertError);
      goto('/cms/complete-profile');
      return;
    }

    const { role, verification_status, profile_completed, is_reviewer } = profile;
    const normalizedRole = role === 'Reviewer' ? 'Doctor' : role;
    
    // Super Admins and Admins bypass profile completion
    if (normalizedRole === 'Super_Admin') {
      goto('/cms/super-admin');
      return;
    } else if (normalizedRole === 'Admin') {
      goto('/cms/admin-dashboard');
      return;
    }

    if (!profile_completed) {
      goto('/cms/complete-profile');
      return;
    }

    if (normalizedRole === 'Doctor') {
      if (verification_status === 'approved') {
        goto('/cms/doctor-dashboard');
      } else {
        goto('/cms/pending');
      }
    } else if (normalizedRole === 'Reader') {
      goto('/cms/reader-dashboard');
    } else if (is_reviewer) {
      goto('/cms/doctor-dashboard');
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