<script lang="ts">
  import { cmsSupabase } from '$lib/cmsSupabase';
  import Nav from '$lib/components/nav.svelte';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function login() {
    error = '';
    loading = true;

    try {
      const { data, error: authError } = await cmsSupabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      const user = data.user;

      // Role fetch karo
      const { data: profile, error: profileError } = await cmsSupabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const role = profile?.role || 'user';

      if (role === 'author') {
    goto('/cms/author_dashboard');
} else if (role === 'testimonial_writer') {
    goto('/cms/testimonial_dashboard');
} else if (role === 'editor_approver') {
    goto('/cms/editor_dashboard');
} else if (role === 'cms_admin' || role === 'super_admin') {
    goto('/cms/admin/admin_dashboard');
} else {
        // Normal user — author request check karo
        const { data: request } = await cmsSupabase
          .from('author_requests')
          .select('status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!request) {
          // Koi request nahi — author request form pe bhejo
          goto('/cms/author-request');
        } else if (request.status === 'pending') {
          goto('/cms/pending');
        } else if (request.status === 'rejected') {
          goto('/cms/pending');
        } else {
          goto('/cms/pending');
        }
      }

    } catch (err: any) {
      error = err.message || 'Login failed';
    } finally {
      loading = false;
    }
  }
</script>

<Nav />

<div class="login-container">
  <div class="login-card">
    <h2>Welcome Back</h2>
    <p class="subtitle">Login to your CMS account</p>

    <input
      type="email"
      placeholder="Email address"
      bind:value={email}
    />

    <input
      type="password"
      placeholder="Password"
      bind:value={password}
    />

        <a href="/cms/forgot" class="forgot-link">Forgot Password?</a>

    <button on:click={login} disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
    </button>

    <p class="signup-link">
        Don't have an account?
        <a href="/cms/signup">Sign up</a>
    </p>

    {#if error}
      <p class="error">{error}</p>
    {/if}
  </div>
</div>

<style>
.login-container {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #f5f7fb;
  box-sizing: border-box;
}

.login-card {
  width: 380px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  text-align: center;
}

h2 { margin-bottom: 5px; color: #2c3e50; }
.subtitle { font-size: 14px; color: #777; margin-bottom: 25px; }

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  background: #2f80ed;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
}

button:hover { background: #1c6dd0; }
button:disabled { background: #9ab8e8; cursor: not-allowed; }

.error { color: red; font-size: 13px; margin-top: 10px; }
.signup-link { margin-top: 15px; font-size: 14px; }
a { color: #2f80ed; text-decoration: none; }

.forgot-link {
    display: block;
    text-align: right;
    margin: -8px 0 16px;
    font-size: 13px;
    color: #0155bd;
    text-decoration: none;
}
.forgot-link:hover { text-decoration: underline; }
</style>