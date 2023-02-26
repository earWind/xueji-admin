<template>
  <div class="main">
    <el-card class="search-box">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="query.user" placeholder="姓名" clearable />
        </el-form-item>
        <el-form-item label="账号">
          <el-select v-model="query.region" placeholder="账号" clearable>
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="姓名" width="180" />
        <el-table-column prop="name" label="账号" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="query.currentPage"
        v-model:page-size="query.pageSize"
        small
        background
        layout="total, sizes, prev, pager, next"
        hide-on-single-page
        :page-sizes="[100, 200, 300, 400]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="新增用户">
      <el-form :model="form" label-width="100">
        <el-form-item label="姓名">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="账号">
          <el-select v-model="form.account" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  interface User {
    date: string;
    name: string;
    address: string;
  }

  const tableData: User[] = [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ];

  const query = reactive({
    user: '',
    region: '',
    pageSize: 20,
    currentPage: 1,
  });
  const dialogFormVisible = ref(false);
  const form = reactive({ name: '', account: '' });
  const total = ref(0);

  function handleEdit(index: number, row: User) {
    console.log(index, row);
    dialogFormVisible.value = true;
  }

  async function handleDelete(index: number, row: User) {
    console.log(index, row);
    ElMessageBox.confirm('是否删除?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        ElMessage({
          type: 'success',
          message: 'Delete completed',
        });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        });
      });
  }

  async function onSubmit() {
    console.log('submit!');
  }

  function handleCreate() {
    dialogFormVisible.value = true;
  }

  function handleSizeChange() {}

  function handleCurrentChange() {}

  function handleReset() {
    Object.assign(query, {
      user: '',
      region: '',
      currentPage: 1,
      pageSize: 20,
    });
  }
</script>

<style scoped lang="scss">
  .search-box {
    margin-bottom: 20px;
  }

  :deep(.el-pagination) {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
</style>
