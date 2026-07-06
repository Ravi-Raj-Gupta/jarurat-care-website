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

    // Profile check karo — agar nahi hai toh banao
    const { data: profile } = await cmsSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      await cmsSupabase.from('profiles').insert([{
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        role: 'user'
      }]);
      goto('/cms/author-request');
      return;
    }

    // Role ke hisaab se redirect karo
    const role = profile.role;
    if (role === 'author') goto('/cms/author_dashboard');
    else if (role === 'testimonial_writer') goto('/cms/testimonial_dashboard');
    else if (role === 'cms_admin' || role === 'super_admin') goto('/cms/admin/admin_dashboard');
    else {
      const { data: request } = await cmsSupabase
        .from('author_requests')
        .select('status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!request) goto('/cms/author-request');
      else goto('/cms/pending');
    }
  });
</script>

<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f7fb;">
  <div style="text-align:center;">
    <p style="font-size:18px;color:#0d2460;font-weight:700;">Setting up your account...</p>
    <p style="color:#6b7280;margin-top:8px;">Please wait</p>
  </div>
</div>