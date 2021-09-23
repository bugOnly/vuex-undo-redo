const txtPool = [
  '远看山有色',
  '近听水无声',
  '春去花还在',
  '人来鸟不惊'
];

const MUTATION_TYPES = {
  ADD_ONE_LINE: 'ADD_ONE_LINE',
  DEL_ONE_LINE: 'DEL_ONE_LINE',
  UPDATE_ONE_LINE: 'UPDATE_ONE_LINE'
};

const state = {
  content: []
};

const getters = {
  content: state => state.content
};

const mutations = {
  [MUTATION_TYPES.ADD_ONE_LINE](state,txt){
    state.content.push(txt);
  },
  [MUTATION_TYPES.DEL_ONE_LINE](state,index){
    state.content.splice(index,1);
  },
  [MUTATION_TYPES.UPDATE_ONE_LINE](state,{index,txt}){
    const newContent = [...state.content];
    newContent[index] = txt;

    state.content = newContent;
  }
};

const actions = {
  addOneLine({commit}){
    const txt = txtPool[Math.floor(Math.random()*(txtPool.length-1))];
    commit(MUTATION_TYPES.ADD_ONE_LINE,txt);
  },
  delOneLine({commit,state}){
    if(state.content.length === 0 ){
      return;
    }
    const index = Math.floor(Math.random()*(state.content.length-1));
    commit(MUTATION_TYPES.DEL_ONE_LINE,index);
  },
  updateOneLine({commit,state}){
    if(state.content.length === 0){
      return;
    }
    const index = Math.floor(Math.random()*(state.content.length-1));
    const txt = txtPool.find(item=>item!==state.content[index]);
    commit(MUTATION_TYPES.UPDATE_ONE_LINE,{index,txt});
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,getters
}