<template>
<section id="sample">
  <div>
    <p v-for="(item,index) in content" :key="`content-${index}`">
      {{item}}
    </p>
  </div>
  <div id="edit-panel">
    <el-button-group>
      <el-button 
        type="primary" 
        size="small" 
        icon="el-icon-plus"
        @click="addOneLine">增加一行文字</el-button>
      <el-button 
        type="primary" 
        size="small" 
        icon="el-icon-close"
        @click="delOneLine">删除一行文字</el-button>
      <el-button 
        type="primary" 
        size="small" 
        icon="el-icon-edit"
        @click="updateOneLine">更改一行文字</el-button>
    </el-button-group>
  </div>
  <div id="action-panel">
    <el-button-group>
      <el-button type="primary" size="small" @click="undo">撤回</el-button>
      <el-button type="primary" size="small" @click="redo">恢复</el-button>
    </el-button-group>
  </div>
</section>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import { history } from '../store';

export default {
  name: 'Sample',
  computed: {
    ...mapGetters('content',[
      'content'
    ])
  },
  methods: {
    ...mapActions('content',[
      'addOneLine',
      'delOneLine',
      'updateOneLine'
    ]),
    undo(){
      console.log('undo')
      if(!history.canUndo()){
        return this.$message({
          message: '当前已是最久的历史记录',
          type: 'warning'
        });
      }
      history.undo();
    },
    redo(){
      if(!history.canRedo()){
        return this.$message({
          message: '当前已是最新的历史记录',
          type: 'warning'
        });
      }
      history.redo();
    }
  }
}
</script>

<style scoped>
#edit-panel{
  margin-bottom: 10px;
}
</style>
