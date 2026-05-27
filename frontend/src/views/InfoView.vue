<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4">
    <div class="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div class="text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900">
          Info &amp; About PokéTeam Master AI
        </h1>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
          PokéTeam Master AI helps you build competitive teams, analyze weaknesses and keep
          your Pokémon strategy organized in one place.
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-2">
        <section class="rounded-3xl border border-slate-200 p-6 bg-slate-50">
          <h2 class="text-2xl font-semibold text-slate-900 mb-3">Why use PokéTeam Master AI?</h2>
          <ul class="space-y-3 text-gray-600">
            <li class="flex gap-3">
              <span class="text-blue-600">•</span>
              Save and manage your best team combinations with ease.
            </li>
            <li class="flex gap-3">
              <span class="text-blue-600">•</span>
              Analyze your team’s type coverage, weaknesses and strengths.
            </li>
            <li class="flex gap-3">
              <span class="text-blue-600">•</span>
              Access your team library from any device once deployed.
            </li>
          </ul>
        </section>

        <section class="rounded-3xl border border-slate-200 p-6 bg-slate-50">
          <h2 class="text-2xl font-semibold text-slate-900 mb-3">Tech Stack</h2>
          <div class="space-y-4 text-gray-600">
            <p>
              Backend: Django + Django REST Framework with PostgreSQL on Neon.
            </p>
            <p>
              Frontend: Vue 3, Vite and Tailwind CSS for a fast, responsive UI.
            </p>
            <p>
              External Data: PokéAPI for real-time Pokémon details and stats.
            </p>
          </div>
        </section>
      </div>

      <div class="mt-10 grid gap-6 lg:grid-cols-2">
        <div class="rounded-3xl border border-slate-200 p-6 bg-white">
          <h3 class="text-xl font-semibold text-slate-900 mb-3">How it works</h3>
          <ol class="list-decimal list-inside space-y-3 text-gray-600">
            <li>Create your teams from the dashboard.</li>
            <li>Search Pokémon and assign them to team slots.</li>
            <li>Analyze coverage and weaknesses with a single click.</li>
            <li>Save your progress and revisit any team later.</li>
          </ol>
        </div>

        <div class="rounded-3xl border border-slate-200 p-6 bg-white">
          <h3 class="text-xl font-semibold text-slate-900 mb-3">Support</h3>
          <p class="text-gray-600 mb-4">
            This is a fan-made educational interface. For issues or future improvements,
            consult the project documentation or add your ideas in the repo.
          </p>
          <router-link
            to="/equipos"
            class="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Go back to Teams
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoView',
}
</script>

<style scoped>
</style>
