<script>

let user = {
  name: "Demo Author",
  role: "Author",
  email: "author@example.com"
};

</script>

<div class="dashboard">

<h1>Author Dashboard</h1>
<h1>this page is still working should be available soon</h1>

<p>Welcome, {user.name}</p>

<div class="card">

<h3>User Info</h3>

<p><strong>Name:</strong> {user.name}</p>
<p><strong>Email:</strong> {user.email}</p>
<p><strong>Role:</strong> {user.role}</p>

</div>


</div>

<style>

.dashboard{
padding:40px;
font-family:Arial, sans-serif;
}

h1{
color:#2c3e50;
margin-bottom:20px;
}

.card{
background:white;
padding:20px;
margin-bottom:20px;
border-radius:8px;
box-shadow:0 4px 10px rgba(0,0,0,0.05);
}

ul{
padding-left:20px;
}

li{
margin-bottom:8px;
}

</style>