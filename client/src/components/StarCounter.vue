<template lang="html">
    <div class="starCounter">
        Stars: {{starCount}} <i class="fas fa-user"></i>

    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['starCount']),
    },
    data() {
        return {
            watchers: this.starCount
        }
    }
}
</script>

<style lang="css">
    .starCounter{
        color: #9FFF70;
    }
</style>
