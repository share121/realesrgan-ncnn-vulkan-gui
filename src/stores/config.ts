export const useConfigStore = defineStore('config', {
  state: () => ({
    scale: '4',
    modelName: 'realesr-animevideov3',
    outputDir: ''
  }),
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }]
  }
})
