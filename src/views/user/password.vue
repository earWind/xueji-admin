<template>
  <div class="main">
    <el-card class="sbumit-box">
      <el-form :model="form" label-width="100">
        <el-form-item label="账号">
          <el-input v-model="account" autocomplete="off" style="width: 400px" readonly />
        </el-form-item>
        <el-form-item label="原密码">
          <el-input v-model="form.oldPwd" autocomplete="off" style="width: 400px" type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.newPwd" autocomplete="off" style="width: 400px" type="password" />
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" :loading="okLoading" @click="editOk" style="width: 400px">
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, unref, reactive } from 'vue';
  import { userUpdatePwd } from '@/api';
  import { ElMessage } from 'element-plus';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();
  const account = userStore.username;
  const form = reactive({ newPwd: '', oldPwd: '', operatorId: userStore.userId });
  const okLoading = ref(false);

  async function editOk() {
    try {
      const { code, message } = await userUpdatePwd({ ...unref(form) });

      if (code === 200) {
        ElMessage({
          type: 'success',
          message: '密码修改成功',
        });
      } else {
        ElMessage({
          type: 'error',
          message: message,
        });
      }
    } catch (err) {
      ElMessage({
        type: 'error',
        message: '密码修改失败',
      });
    }
  }
</script>

<style scoped lang="scss">
  .main {
    width: 600px;
    height: 600px;
    position: absolute;
    top: calc(50% - 300px);
    left: calc(50% - 300px);

    .sbumit-box {
      padding-top: 20px;
    }
  }
</style>
