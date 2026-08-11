<script lang="ts">
    import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
    import Topbar from '$lib/components/dashboard/Topbar.svelte';
    import DoctorCard from '$lib/components/community/DoctorCard.svelte';


    export let data;


    $: profile = data.profile;
    $: doctors = data.doctors;
    $: followedDoctorIds = new Set(data.followedDoctorIds);
</script>


<div class="dashboard">
    <Sidebar isReviewer={profile?.is_reviewer === true} />


    <div class="content">
        <Topbar
            doctorName={profile?.full_name || ''}
            unreadCount={0}
        />


        <div class="page">


            <h1>Community Doctors</h1>


            <p>Browse all registered doctors.</p>


            <div class="doctor-grid">


                {#each doctors as doctor}
                    <DoctorCard 
                        {doctor} 
                        isFollowed={followedDoctorIds.has(doctor.id)} 
                        isSelf={doctor.id === profile?.id}
                    />
                {/each}


            </div>


        </div>
    </div>
</div>


<style>


.dashboard{
    display:flex;
    min-height:100vh;
    background:#f5f7fb;
}


.content{
    flex:1;
    display:flex;
    flex-direction:column;
}


.page{
    padding:30px;
}


.doctor-grid{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
    gap:20px;
    margin-top:25px;
}


</style> 