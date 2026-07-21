<script lang="ts">
	export let doctor;
</script>

<div class="doctor-card">

	<div class="avatar">
		{doctor.full_name
			? doctor.full_name
					.split(' ')
					.map((word) => word[0])
					.join('')
					.slice(0, 2)
					.toUpperCase()
			: 'DR'}
	</div>

	<h3>{doctor.full_name}</h3>

	{#if doctor.designation}
		<p class="designation">{doctor.designation}</p>
	{/if}

	{#if doctor.specialization}
		<p>{doctor.specialization}</p>
	{/if}

	{#if doctor.organization}
		<p>🏥 {doctor.organization}</p>
	{/if}

	{#if doctor.city_state}
		<p>📍 {doctor.city_state}</p>
	{/if}

	{#if doctor.qualification}
		<p>🎓 {doctor.qualification}</p>
	{/if}

	{#if doctor.experience}
		<p>🩺 {doctor.experience} Years Experience</p>
	{/if}

	<div class="actions">
		<button class="profile-btn">
			View Profile
		</button>

		<button class="follow-btn">
			Follow
		</button>
	</div>

</div>

<style>
.doctor-card{
	background:white;
	border-radius:16px;
	padding:24px;
	box-shadow:0 8px 24px rgba(0,0,0,.05);
	display:flex;
	flex-direction:column;
	align-items:center;
	text-align:center;
	gap:10px;
	transition:.25s;
}

.doctor-card:hover{
	transform:translateY(-4px);
}

.avatar{
	width:70px;
	height:70px;
	border-radius:50%;
	background:#202866;
	color:white;
	display:flex;
	align-items:center;
	justify-content:center;
	font-size:24px;
	font-weight:bold;
}

h3{
	margin:0;
	font-size:22px;
}

.designation{
	font-weight:600;
	color:#202866;
}

.actions{
	display:flex;
	gap:10px;
	margin-top:15px;
	width:100%;
}

.actions button{
	flex:1;
	padding:10px;
	border:none;
	border-radius:8px;
	cursor:pointer;
	font-weight:600;
}

.profile-btn{
	background:#eef2ff;
	color:#202866;
}

.profile-btn:hover{
	background:#dbe4ff;
}

.follow-btn{
	background:#202866;
	color:white;
}

.follow-btn:hover{
	background:#313b86;
}
</style>