<script>
import { auth } from '$lib/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import Nav from "$lib/components/nav.svelte";
import { goto } from '$app/navigation';
let email = "";
let password = "";
let error = "";

async function login() {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    goto('/cms/author_dashboard');
  } catch (err) {
    error = err.message;
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

<button on:click={login}>
Login
</button>

<a href="/cms/forgot">Forgot Password?</a>

<p class="error">{error}</p>

<p class="signup-link">
Don't have an account?
<a href="/cms/signup">Sign up</a>
</p>

</div>

</div>

<style>

.login-container{
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#f5f7fb;
}

.login-card{
width:380px;
padding:40px;
background:white;
border-radius:10px;
box-shadow:0 8px 20px rgba(0,0,0,0.08);
text-align:center;
}

h2{
margin-bottom:5px;
color:#2c3e50;
}

.subtitle{
font-size:14px;
color:#777;
margin-bottom:25px;
}

input{
width:100%;
padding:12px;
margin-bottom:15px;
border:1px solid #ddd;
border-radius:6px;
font-size:14px;
}

button{
width:100%;
padding:12px;
background:#2f80ed;
border:none;
color:white;
border-radius:6px;
cursor:pointer;
font-size:15px;
}

button:hover{
background:#1c6dd0;
}

a{
display:block;
margin-top:10px;
font-size:13px;
color:#2f80ed;
text-decoration:none;
}

.error{
color:red;
font-size:13px;
margin-top:10px;
}

.signup-link{
margin-top:15px;
font-size:14px;
}

</style>