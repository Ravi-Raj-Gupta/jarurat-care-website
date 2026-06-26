<script lang="ts">
  import { cmsSupabase } from '$lib/cmsSupabase';
  import Nav from '$lib/components/nav.svelte';
  import toast from 'svelte-french-toast';
  import { goto } from '$app/navigation';

  let fullName = '';
  let email = '';
  let password = '';
  let message = '';
  let loading = false;
  let success = false;

  function validatePassword(password: string) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return pattern.test(password);
  }

  async function signup() {
    message = '';

    if (!fullName.trim()) {
      message = 'Please enter your full name.';
      return;
    }

    if (!validatePassword(password)) {
      message = 'Password must be at least 8 characters and include uppercase, lowercase, number and special character.';
      return;
    }

    loading = true;

    try {
      // Register in CMS Supabase
      const { data, error: authError } = await cmsSupabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      const user = data.user;

      if (user) {
        // Insert into profiles table
        const { error: profileError } = await cmsSupabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            full_name: fullName,
            role: 'user'
          }]);

        if (profileError) throw profileError;
      }

      success = true;
      message = 'Account created successfully! Redirecting to login...';
      toast.success('Registration successful!');
      
      setTimeout(() => {
        goto('/cms/login');
      }, 2000);
      
      fullName = '';
      email = '';
      password = '';

    } catch (err: any) {
      message = err.message || 'Signup failed';
    } finally {
      loading = false;
    }
  }
</script>

<Nav />

<div class="auth-container">
  <div class="auth-card">
    <h2>Create Account</h2>
    <p class="subtitle">Register for the CMS</p>

    <input
      type="text"
      placeholder="Full Name"
      bind:value={fullName}
    />

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

    <button on:click={signup} disabled={loading}>
      {loading ? 'Creating account...' : 'Sign Up'}
    </button>

    {#if message}
      <p class="message" class:success={success}>{message}</p>
    {/if}

    <p class="switch-link">
      Already have an account?
      <a href="/cms/login">Login</a>
    </p>
  </div>
</div>

<style>
.auth-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fb;
}

.auth-card {
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

.message { margin-top: 12px; font-size: 13px; color: red; }
.message.success { color: green; }

.switch-link { margin-top: 18px; font-size: 14px; }
a { color: #2f80ed; text-decoration: none; }
</style>