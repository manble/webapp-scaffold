<template>
    <h1>{{ msg }}</h1>
</template>
<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Hello World!'
    }
  }
}
</script>
<style lang="scss" scoped>
h1 {
    text-align: center;
    color: red;
}
</style>