// my-behavior.js
const app = getApp()
module.exports = Behavior({
  behaviors: [],
  properties: {
    myBehaviorProperty: {
      type: String
    }
  },
  data: {
    myBehaviorData: 'my-behavior-data'
  },
  created: function () {
    console.log('created')
  },
  attached: function () {
    console.log('attached')
  },
  ready: function () {
    console.log('ready')
  },

  methods: {
    navigation() {
      console.log(1)
    },
    getInfo() {
      console.log('[my-behavior] log by myBehaviorMehtod')
    },
    getData(id) {

    }
  }
})