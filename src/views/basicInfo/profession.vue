<template>
  <div class="main">
    <el-card class="search-box">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="专业名称">
          <el-input
            v-model="query.majorName"
            placeholder="请输入专业名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="专业类别">
          <el-input
            v-model="query.majorType"
            placeholder="请输入专业类别"
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
        <el-table-column prop="majorName" label="专业名称" width="180" />
        <el-table-column prop="majorNo" label="专业编号" />
        <el-table-column prop="majorType" label="专业类别" />
        <el-table-column prop="majorDescr" label="专业介绍" />
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
      :title="(form.id ? '修改' : '新增') + '专业'"
      width="600"
    >
      <el-form :model="form" label-width="100">
        <el-form-item label="专业名称">
          <el-input v-model="form.majorName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="专业编号">
          <el-input v-model="form.majorNo" autocomplete="off" />
        </el-form-item>
        <el-form-item label="专业类别">
          <el-input v-model="form.majorType" autocomplete="off" />
        </el-form-item>
        <el-form-item label="专业介绍">
          <el-input v-model="form.majorDescr" autocomplete="off" type="textarea" />
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
  import { majorListPage, majorAdd, majorUpdate, majorDelete } from '@/api';
  import { deepCopy } from '@/utils';
  import { useUserStore } from '@/store/modules/user';

  interface FormItem {
    id: string;
    majorName: string;
    majorNo: string;
    majorType: string;
    majorDescr: string;
    [key: string]: string;
  }

  const formLayout = { id: '', majorName: '', majorNo: '', majorType: '', majorDescr: '' };
  const queryLayout = {
    majorName: '',
    majorType: '',
    pageSize: 10,
    pageNum: 1,
  };
  const userStore = useUserStore();
  const tableData = ref<FormItem[]>([]);
  const query = reactive(deepCopy(queryLayout));
  const dialogFormVisible = ref(false);
  const form = reactive(deepCopy(formLayout));
  const total = ref(0);
  const okLoading = ref(false);

  onMounted(() => {
    queryList();
  });

  async function queryList() {
    const { code, data } = await majorListPage(unref(query));

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
    const param = { ...form, operatorId: userStore.userId };

    okLoading.value = true;
    try {
      const api = param.id ? majorUpdate : majorAdd;
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
    const { id, majorName, majorNo, majorType, majorDescr } = row;
    Object.assign(form, {
      id,
      majorName,
      majorNo,
      majorType,
      majorDescr,
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
          const { code, message } = await majorDelete(row.id);

          if (code === 200) {
            ElMessage({
              type: 'success',
              message: '操作成功',
            });
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
