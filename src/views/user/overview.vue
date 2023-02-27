<template>
  <div class="main">
    <el-card class="search-box">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="用户账号">
          <el-input
            v-model="query.account"
            placeholder="请输入用户账号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input
            v-model="query.name"
            placeholder="请输入用户姓名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="queryList">查询</el-button>
          <el-button type="primary" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="account" label="用户账号" width="180" />
        <el-table-column prop="name" label="用户姓名" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="query.pageNum"
        v-model:page-size="query.pageSize"
        small
        background
        layout="total, sizes, prev, pager, next"
        hide-on-single-page
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <el-dialog
      v-model="dialogFormVisible"
      :title="(form.id ? '修改' : '新增') + '用户'"
      width="600"
    >
      <el-form :model="form" label-width="100">
        <el-form-item label="账号">
          <el-input v-model="form.account" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="权限集">
          <el-checkbox-group v-model="form.permissionSet">
            <el-checkbox
              v-for="item in permissionSetOptions"
              :key="item.value"
              :label="item.label"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="form.userType">
            <el-option
              v-for="item in userTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel">取消</el-button>
          <el-button type="primary" :loading="okLoading" @click="editOk">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, unref, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { userListPage, userAdd, userUpdate, userDelete } from '@/api';
  import { deepCopy } from '@/utils';

  interface FormItem {
    id: string;
    account: string;
    name: string;
    userType: number;
    permissionSet: string[];
    [key: string]: any;
  }

  const formLayout = { id: '', account: '', name: '', userType: '', permissionSet: [] };
  const queryLayout = {
    account: '',
    name: '',
    pageSize: 10,
    pageNum: 1,
  };
  const tableData = ref<FormItem[]>([]);
  const query = reactive(deepCopy(queryLayout));
  const dialogFormVisible = ref(false);
  const form = reactive(deepCopy(formLayout));
  const total = ref(0);
  const okLoading = ref(false);
  const userTypeOptions = [
    {
      label: '系统管理员',
      value: 1,
    },
    {
      label: '班主任',
      value: 2,
    },
    {
      label: '任课教师',
      value: 3,
    },
    {
      label: '一般查询用户',
      value: 4,
    },
  ];
  const permissionSetOptions = [
    {
      label: '用户管理',
      value: 'USER',
    },
    {
      label: '学籍档案管理',
      value: 'ARCHIVE',
    },
    {
      label: '成绩管理',
      value: 'SCORE',
    },
    {
      label: '日常行为管理',
      value: 'BEHAVIOR',
    },
  ];

  onMounted(() => {
    queryList();
  });

  async function queryList() {
    const { code, data } = await userListPage(unref(query));

    if (code === 200) {
      tableData.value = data.records;
      total.value = data.total;
    }
  }

  function editCancel() {
    dialogFormVisible.value = false;
    Object.assign(form, deepCopy(formLayout));
  }

  async function editOk() {
    const param = { ...form, operatorId: 1 };

    param.permissionSet = param.permissionSet.map((item) => {
      return permissionSetOptions.reduce((pre, cur) => {
        if (item === cur.label) {
          pre = cur.value;
        }
        return pre;
      }, '');
    });

    okLoading.value = true;
    try {
      const api = param.id ? userUpdate : userAdd;
      const { code, message } = await api(param);

      if (code === 200) {
        ElMessage({
          type: 'success',
          message: '操作成功',
        });
        editCancel();
        queryList();
      } else {
        ElMessage({
          type: 'error',
          message: message,
        });
      }
    } catch (err) {
      ElMessage({
        type: 'error',
        message: '操作失败',
      });
    }
    okLoading.value = false;
  }

  function handleEdit(row: FormItem) {
    const { id, account, name, userType, permissionSet2 } = row;

    const permissionSetLabel = permissionSet2.map((item) => {
      return permissionSetOptions.reduce((pre, cur) => {
        if (item === cur.value) {
          pre = cur.label;
        }
        return pre;
      }, '');
    });
    Object.assign(form, {
      id,
      account,
      name,
      userType,
      permissionSet: permissionSetLabel,
    });
    dialogFormVisible.value = true;
  }

  async function handleDelete(row: FormItem) {
    ElMessageBox.confirm('是否删除?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          const { code, data } = await userDelete(row.id);

          if (code === 200) {
            ElMessage({
              type: 'success',
              message: '操作成功',
            });
            queryList();
          } else {
            ElMessage({
              type: 'error',
              message: data.message,
            });
          }
        } catch (err) {
          ElMessage({
            type: 'error',
            message: '操作失败',
          });
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        });
      });
  }

  function handleCreate() {
    dialogFormVisible.value = true;
  }

  function handleSizeChange(size) {
    query.pageSize = size;
    queryList();
  }

  function handleCurrentChange(pageNum) {
    query.pageNum = pageNum;
    queryList();
  }

  function handleReset() {
    Object.assign(query, deepCopy(queryLayout));
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
