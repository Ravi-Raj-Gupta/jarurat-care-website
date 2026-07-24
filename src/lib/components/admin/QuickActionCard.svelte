<script>
    export let title = "";
    export let description = "";
    export let href = "#";
</script>

<a class="action-card" href={href}>

    <h3>{title}</h3>

    <p>{description}</p>

</a>

<style>
.action-card{
    display:block;
    text-decoration:none;

    background:white;

    border-radius:16px;

    padding:20px;

    border:1px solid #eef2f7;

    transition:.25s;
}

.action-card:hover{
    transform:translateY(-4px);
    box-shadow:0 10px 30px rgba(0,0,0,.08);
}

h3{
    margin:0 0 10px;
    color:#2563eb;
}

p{
    margin:0;
    color:#64748b;
    font-size:14px;
    line-height:1.5;
}
</style>