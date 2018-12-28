const getters = {
  selectedCount: state => state.selected.length,
  isFiles: state => !state.loading && state.route.name === 'Files',
  isListing: (state, getters) => getters.isFiles && state.req.isDir,
  isEditor: (state, getters) => getters.isFiles && state.req.type === 'text'
}

export default getters
