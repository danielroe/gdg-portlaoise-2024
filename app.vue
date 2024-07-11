<template>
  <main class="container">
    <h1>GDG Portlaoise</h1>
    <div>
      <!-- Form to modify page -->
      <form @submit.prevent="submitRequest">
        <label>
          What do you want to change?
          <input type="text" v-model="prompt">
        </label>
        <button :aria-busy="loading" type="submit">Submit</button>
      </form>
      <!-- Display some data -->
      <MalleableComponent />
    </div>
  </main>
</template>

<script setup lang="ts">
import '@picocss/pico'

const prompt = ref('')

const malleables = reactive({
  template: `
      <ul>
        <li v-for="country in data.data.countries">
          {{ country.name }}
        </li>
      </ul>
  `,
  query: `
{
  countries {
    awsRegion
    code
    capital
    name
    continent {
      name
      code
    }
    emoji
    currencies
  }
}
`
})

const loading = ref(false)
async function submitRequest() {
  loading.value = true
  try {
    const data = await $fetch('/api/completion', {
      method: 'POST',
      body: {
        malleables,
        prompt: prompt.value
      }
    })
    console.log(data)
    Object.assign(malleables, data)
  } catch (e) {
    console.log(e)
  }
  loading.value = false
}

const MalleableComponent = defineComponent({
  async setup () {
    const { data } = await useFetch('https://countries.trevorblades.com/', {
      method: 'POST',
      body: {
        query: malleables.query
      }
    })

    return () => h({
      data: () => ({ data }),
      template: malleables.template
    })
  },
})
</script>
