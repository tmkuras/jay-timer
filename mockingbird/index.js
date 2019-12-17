Vue.component('state', {
  template: `
    <div class="box state" :class="{active: enabled}" @click="click_event">
      <p><b>{{name}}</b></p>
      <p class="clock">{{clock}}</p>
      <ul v-if="history.length">
        <li v-for="item in history">{{item}}</li>
      </ul>
    </div>
  `,
  props: ['name', 'active_state'],
  data: function() {
    return {
      time: 0,
      timer: null,
      history: [],
    };
  },
  watch: {
    enabled: function(new_val, old_val) {
      this.toggle();
    },
  },
  computed: {
  	clock: function() {
    	return format_clock(this.time);
    },
    enabled: function() {
      return this.name == this.active_state;
    },
  },
  methods: {
    toggle: function() {
      if (this.enabled) {
        this.timer = setInterval(this.increment, 1000);
      } else {
        clearInterval(this.timer);
        this.history.push(this.clock);
        this.time = 0;
      }
    },
    increment: function() {
      this.time += 1;
    },
    click_event: function() {
      this.$emit('click_event', this.name)
    },
  },
})

Vue.component('event', {
  template: `
    <div class="box event" @click="log">
      <p><b>{{name}}</b></p>
      <ul v-if="history.length">
        <li v-for="item in history">{{item}}</li>
      </ul>
    </div>
  `,
  props: ['name'],
  data: function() {
    return {
      history: [],
    };
  },
  methods: {
    log: function() {
      this.history.push(new Date().toLocaleTimeString())
    },
  },
})

Vue.component('toggle', {
  template: `
    <div class="box" :class="{active: enabled}" @click="log">
      <p><b>{{name}}</b></p>
      <p>Total: {{total}}</p>
    </div>
  `,
  props: ['name'],
  data: function() {
    return {
      timer_start: null,
      history: [],
    };
  },
  computed: {
    enabled: function() {
      return this.timer_start !== null;
    },
    total: function() {
      return this.history.reduce((a,b) => a + b, 0);
    },
  },
  methods: {
    log: function() {
      if (this.timer_start === null) {
        this.timer_start = new Date();
      } else {
        timer_diff = (new Date() - this.timer_start) / 1000;
        this.history.push(timer_diff);
        this.timer_start = null;
      }
    },
  },
})

function format_clock(time) {
  clock = [0, 0, 0];
  i = 0;
  while (time > 0) {
    clock[i] = time % 60;
    time = Math.floor(time / 60);
    i += 1;
  }
  return clock.reverse().map(num_pad).join(":");
}

function num_pad(num) {
  if (num < 10) {
    return '0' + num;
  } else {
    return num;
  }
}

vm = new Vue({
  el: '#app',
  data: {
    states: new Set([
      'Singing',
      'PerchNoSing',
      'Foraging',
      'Preening',
      'Flying',
      'Unknown',
    ]),
    events: new Set([
      'Head',
      'Chat',
      'Hew',
      'ChangePos',
    ]),
    toggles: new Set([
      'Out of sight',
    ]),
    active_state: null,
  },
  methods: {
    set_active_state: function(name) {
      if (this.active_state == name) {
        this.active_state = null;
      } else {
        this.active_state = name;
      }
    },
  },
})
