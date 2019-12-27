Vue.component('state', {
  template: `
    <div class="box state" :class="{active: enabled}" @click="$emit('set_active_state', name)">
      <p class="label">{{name}}</p>
      <p class="clock">{{clock}}</p>
      <div class="circle"><p>{{history.length}}</p></div>
    </div>
  `,
  props: ['name', 'active_state', 'history'],
  data: function() {
    return {
      time: 0,
      timer: null,
      timer_start: null,
    }
  },
  watch: {
    enabled: function(new_val, old_val) {
      this.toggle()
    },
  },
  computed: {
    clock: function() {
      return format_clock(this.time)
    },
    enabled: function() {
      return this.name == this.active_state
    },
  },
  methods: {
    toggle: function () {
      if (this.enabled) {
        this.timer_start = new Date()
        this.time = 0
        this.timer = setInterval(this.increment, 1000)
      } else {
        timer_diff = (new Date() - this.timer_start) / 1000
        this.history.push([this.timer_start.toLocaleTimeString(), timer_diff].join(' - '))
        clearInterval(this.timer)
      }
    },
    increment: function() {
      this.time += 1
    },
  },
})

Vue.component('event', {
  template: `
    <div class="box event" @click="log">
      <p class="label">{{name}}</p>
      <p>{{last_time}}</p>
      <div class="circle"><p>{{history.length}}</p></div>
    </div>
  `,
  props: ['name', 'history'],
  computed: {
    last_time: function() {
      if (this.history.length > 0) {
        return this.history[this.history.length - 1]
      } else {
        return null
      }
    }
  },
  methods: {
    log: function() {
      this.history.push(new Date().toLocaleTimeString())
    },
  },
})

Vue.component('toggle', {
  template: `
    <div class="box" :class="{active: enabled}" @click="toggle">
      <p class="label">{{name}}</p>
      <p>{{clock}}</p>
      <div class="circle"><p class="count">{{history.length}}</p></div>
    </div>
  `,
  props: ['name', 'history'],
  data: function() {
    return {
      time: 0,
      timer: null,
      timer_start: null,
    }
  },
  computed: {
    enabled: function() {
      return this.timer_start !== null
    },
    clock: function() {
      return format_clock(this.time)
    },
  },
  methods: {
    toggle: function() {
      if (this.enabled) {
        timer_diff = (new Date() - this.timer_start) / 1000
        this.history.push([this.timer_start.toLocaleTimeString(), timer_diff].join(' - '))
        clearInterval(this.timer)
        this.timer_start = null
      } else {
        this.timer_start = new Date()
        this.time = 0
        this.timer = setInterval(this.increment, 1000)
      }
    },
    increment: function() {
      this.time += 1
    },
  },
})

function format_clock(time) {
  clock = [0, 0, 0]
  i = 0
  while (time > 0) {
    clock[i] = time % 60
    time = Math.floor(time / 60)
    i += 1
  }
  return clock.reverse().map(num_pad).join(':')
}

function num_pad(num) {
  if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}

vm = new Vue({
  el: '#app',
  data: {
    states: {
      Singing: [],
      PerchNoSing: [],
      Foraging: [],
      Preening: [],
      Flying: [],
      Unknown: [],
    },
    events: {
      Head: [],
      ChangePos: [],
      Chat: [],
      Hew: [],
    },
    toggles: {
      'Out of sight': [],
    },
    active_state: null,
  },
  methods: {
    set_active_state: function(name) {
      if (this.active_state == name) {
        this.active_state = null
      } else {
        this.active_state = name
      }
    },
    download: function() {
      data_items = [this.states, this.events, this.toggles]
      header = [].concat(data_items.map(Object.keys))

      values = [].concat(...data_items.map(Object.values))
      max_len = Math.max(...values.map(v => v.length))
      rows = [...Array(max_len).keys()].map(i => values.map(row => row[i]))

      csv = [header].concat(rows).map(v => v.join(',')).join('\n')

      const f = new File([csv], {type: 'text/csv'})
      const link = document.createElement('a')
      link.href = URL.createObjectURL(f)
      link.download = 'mockingbird_data.csv'
      link.click()

      // console.log(csv)
    },
  },
})
