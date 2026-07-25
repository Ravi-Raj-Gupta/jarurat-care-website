<script>
    export let title = "";
    export let value = 0;
    export let icon = "";
</script>

<div class="card">

    <div class="header">
        <span class="icon">{icon}</span>
        <span class="title">{title}</span>
    </div>

    <h2>{value}</h2>

</div>

<style>
.card{
    background:white;
    border-radius:16px;
    padding:24px;
    box-shadow:0 4px 20px rgba(0,0,0,.05);
    transition:.25s ease;
    border:1px solid #eef2f7;
}

.card:hover{
    transform:translateY(-4px);
    box-shadow:0 10px 30px rgba(0,0,0,.08);
}

.header{
    display:flex;
    align-items:center;
    gap:10px;
    margin-bottom:18px;
}

.icon{
    font-size:22px;
}

.title{
    font-size:15px;
    font-weight:600;
    color:#64748b;
}

h2{
    margin:0;
    font-size:34px;
    color:#1e293b;
}
</style>