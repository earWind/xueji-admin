<template>
  <div class="main">
    <el-card class="search-box">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="行为名称">
          <el-input
            v-model="query.behaviorName"
            placeholder="请输入行为名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input
            v-model="query.studentName"
            placeholder="请输入学生姓名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="行为类型">
          <el-select v-model="query.behaviorType" placeholder="请选择行为类型" style="width: 200px">
            <el-option
              v-for="item in behaviorTypeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
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
        <el-table-column prop="behaviorName" label="行为名称" width="180" />
        <el-table-column prop="behaviorType" label="行为类型" />
        <el-table-column prop="descr" label="具体描述" />
        <el-table-column prop="occurrenceDate" label="发生日期" />
        <el-table-column prop="studentName" label="学生姓名" />
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
      :title="(form.id ? '修改' : '新增') + '行为'"
      width="600"
    >
      <el-form :model="form" label-width="100">
        <el-form-item label="行为名称">
          <el-input v-model="form.behaviorName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="行为类型">
          <el-select v-model="form.behaviorType">
            <el-option
              v-for="item in behaviorTypeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学生">
          <el-select v-model="form.studentId">
            <el-option
              v-for="item in studentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发生日期">
          <el-date-picker v-model="form.occurrenceDate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="日常行为描述">
          <el-input v-model="form.descr" autocomplete="off" type="textarea" />
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
  import {
    behaviorListPage,
    behaviorAdd,
    behaviorUpdate,
    behaviorDelete,
    studentListPage,
  } from '@/api';
  import { deepCopy } from '@/utils';
  import { useUserStore } from '@/store/modules/user';

  interface FormItem {
    id: string;
    behaviorName: '';
    behaviorType: '';
    studentName: '';
    descr: '';
    occurrenceDate: '';
    [key: string]: string;
  }

  const formLayout = {
    id: '',
    behaviorName: '',
    behaviorType: '',
    descr: '',
    occurrenceDate: '',
    studentId: '',
  };
  const queryLayout = {
    behaviorName: '',
    behaviorType: '',
    studentName: '',
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
  const behaviorTypeOptions = ['奖励', '惩罚'];
  const studentOptions = ref([]);

  onMounted(() => {
    queryList();
    queryStudentList();
  });

  async function queryList() {
    const { code, data } = await behaviorListPage(unref(query));

    if (code === 200) {
      tableData.value = data.records;
      total.value = data.total;
    }
  }

  async function queryStudentList() {
    const { code, data } = await studentListPage({ pageSize: 9999, pageNum: 1 });

    if (code === 200) {
      studentOptions.value = data.records.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
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
      const api = param.id ? behaviorUpdate : behaviorAdd;
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
    const { id, behaviorName, behaviorType, descr, occurrenceDate, studentId } = row;

    Object.assign(form, {
      id,
      behaviorName,
      behaviorType,
      descr,
      occurrenceDate,
      studentId,
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
          const { code, message } = await behaviorDelete(row.id);

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
