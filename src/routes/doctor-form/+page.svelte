<script>
  import { onMount, onDestroy } from "svelte";
  import Nav from "$lib/components/nav.svelte";
  import FormInput from "$lib/components/form-input.svelte";
  import NewsFooter from "$lib/components/news-footer.svelte";

  let doctorName = "";
  let speciality = "";
  let otherSpeciality = "";
  let email = "";
  let wantsTransactional = false;
  let wantsMarketing = false;

  let showThankYou = false;

  let fieldErrors = {
    doctorName: "",
    speciality: "",
    otherSpeciality: "",
    email: ""
  };

  const specialities = ["MBBS", "MD", "MS", "DNB", "DM", "MCh", "Other"];

  let doctorNameWrap;
  let emailWrap;

  const _listeners = [];

  function attachInputListener(wrapper, setter) {
    if (!wrapper) return;
    const el = wrapper.querySelector("input, textarea, select");
    if (!el) return;
    setter(el.value ?? "");
    const handler = (e) => setter(e.target.value);
    el.addEventListener("input", handler);
    _listeners.push({ el, handler });
  }

  onMount(() => {
    attachInputListener(doctorNameWrap, (v) => (doctorName = v));
    attachInputListener(emailWrap, (v) => (email = v));
  });

  onDestroy(() => {
    for (const { el, handler } of _listeners) {
      try { el.removeEventListener("input", handler); } catch {}
    }
  });

  function readFromWrappers() {
    const dnEl = doctorNameWrap?.querySelector("input,textarea,select");
    if (dnEl) doctorName = dnEl.value ?? doctorName;

    const emEl = emailWrap?.querySelector("input,textarea,select");
    if (emEl) email = emEl.value ?? email;
  }

  function validate() {
    fieldErrors = { doctorName: "", speciality: "", otherSpeciality: "", email: "" };
    let ok = true;

    if (!doctorName.trim()) {
      fieldErrors.doctorName = "Please enter the doctor's name.";
      ok = false;
    }

    if (!speciality) {
      fieldErrors.speciality = "Please select a speciality.";
      ok = false;
    }

    if (speciality === "Other" && !otherSpeciality.trim()) {
      fieldErrors.otherSpeciality = "Please specify the speciality.";
      ok = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      fieldErrors.email = "Please enter an email.";
      ok = false;
    } else if (!emailPattern.test(email.trim())) {
      fieldErrors.email = "Enter a valid email.";
      ok = false;
    }

    return ok;
  }

  function handleSubmit(e) {
    e.preventDefault();
    readFromWrappers();
    if (!validate()) return;

    showThankYou = true;
  }

  function closeModal() {
    showThankYou = false;
    doctorName = "";
    speciality = "";
    otherSpeciality = "";
    email = "";
    wantsTransactional = false;
    wantsMarketing = false;
  }
</script>

<style>
  .input-like {
    padding: 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid #d1d5db;
    width: 100%;
    transition: all 0.2s ease;
  }

  .input-like:focus {
    outline: none;
    border-color: #0155bd;
    box-shadow: 0 0 0 2px rgba(1, 85, 189, 0.15);
  }

  .input-error {
    border-color: #c0392b !important;
    background-color: #fff5f5;
  }

  .error {
    color: #c0392b;
    font-size: 0.85rem;
    margin-top: 4px;
  }

  .btn {
    background: #0155bd;
    color: white;
    padding: 0.6rem 1.25rem;
    border-radius: 999px;
    transition: all 0.2s ease;
  }

  .btn:hover {
    background: #0144a0;
  }

  input[type="checkbox"]:checked {
    background-color: #0155bd;
    border: 2px solid #0155bd;
  }
</style>

<Nav />

<div class="pt-[89px] bg-[#D2DCF7]">
  <div class="max-w-[1312px] mx-auto px-4 py-16 md:py-24">
    <div class="text-center mb-12">
      <h1 class="text-[32px] md:text-[40px] leading-[48px] font-bold text-[#0C1F56]">
        Doctor <span class="text-[#0155BD]">Registration</span>
      </h1>
      <p class="mt-4 text-[16px] md:text-[18px] leading-8 text-[#6B7280] max-w-2xl mx-auto">
        Join the JCF network and stay informed about events where doctors
        across specialities come together to share techniques and support
        each other's practice.
      </p>
    </div>

    <div class="w-full max-w-3xl mx-auto bg-white rounded-[32px] shadow-sm p-8 md:p-12">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-6" on:submit={handleSubmit}>

        <div class="md:col-span-2" bind:this={doctorNameWrap}>
          <FormInput
            data={{ name: "Doctor's Name", placeholder: "Enter full name", type: "text", required: true }}
          />
          {#if fieldErrors.doctorName}
            <div class="error">{fieldErrors.doctorName}</div>
          {/if}
        </div>

        <div>
          <p class="text-sm mb-2 text-[#3B3E43]">Speciality</p>
          <select
            class="input-like text-[#0155BD] bg-[#E8EBF1] {fieldErrors.speciality ? 'input-error' : ''}"
            bind:value={speciality}
          >
            <option value="" disabled selected>Select speciality</option>
            {#each specialities as s}
              <option value={s}>{s}</option>
            {/each}
          </select>
          {#if fieldErrors.speciality}
            <div class="error">{fieldErrors.speciality}</div>
          {/if}
        </div>

        {#if speciality === "Other"}
          <div>
            <p class="text-sm mb-2 text-[#3B3E43]">Please specify</p>
            <input
              class="input-like {fieldErrors.otherSpeciality ? 'input-error' : ''}"
              type="text"
              placeholder="Enter your speciality"
              bind:value={otherSpeciality}
            />
            {#if fieldErrors.otherSpeciality}
              <div class="error">{fieldErrors.otherSpeciality}</div>
            {/if}
          </div>
        {/if}

        <div class="md:col-span-2" bind:this={emailWrap}>
          <FormInput
            data={{ name: "Email ID", placeholder: "Enter your email", type: "email", required: true }}
          />
          {#if fieldErrors.email}
            <div class="error">{fieldErrors.email}</div>
          {/if}
        </div>

        <div class="md:col-span-2">
          <p class="text-sm mb-3 text-[#3B3E43]">
            What kind of emails would you like to receive from JCF?
          </p>
          <div class="flex flex-col gap-3">
            <label class="flex items-center gap-2 text-[#24272A]">
              <input class="h-4 w-4 rounded" type="checkbox" bind:checked={wantsTransactional} />
              Transactional emails (event invites, updates)
            </label>
            <label class="flex items-center gap-2 text-[#24272A]">
              <input class="h-4 w-4 rounded" type="checkbox" bind:checked={wantsMarketing} />
              Marketing emails (newsletters, promotions)
            </label>
          </div>
        </div>

        <div class="md:col-span-2 text-center mt-4">
          <button class="btn" type="submit">Submit</button>
        </div>

      </form>
    </div>
  </div>
</div>

<NewsFooter />

{#if showThankYou}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
    <div class="bg-white rounded-[24px] shadow-lg p-8 md:p-10 max-w-sm w-full text-center">
      <h2 class="text-2xl font-bold text-[#0C1F56] mb-2">Thank You!</h2>
      <p class="text-[#6B7280] mb-6">
        Your form has been submitted successfully. We'll be in touch soon.
      </p>
      <button class="btn" on:click={closeModal}>Close</button>
    </div>
  </div>
{/if}