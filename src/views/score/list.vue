<template>
  <div class="main">
    <el-card class="search-box">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="课程名称">
          <el-input
            v-model="query.courseName"
            placeholder="请输入课程名称"
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
        <el-form-item>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="queryList">查询</el-button>
          <el-button type="primary" @click="handleCreate">新增</el-button>
          <el-button type="primary" @click="handleExport">批量导入</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="courseName" label="课程名称" width="180" />
        <el-table-column prop="score" label="得分" />
        <el-table-column prop="studentName" label="学生姓名" />
        <el-table-column prop="examDate" label="考试日期" />
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
      :title="(form.id ? '修改' : '新增') + '考试成绩'"
      width="600"
    >
      <el-form :model="form" label-width="100">
        <el-form-item label="学生">
          <el-input v-model="form.studentId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程">
          <el-input v-model="form.courseId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="分数">
          <el-input v-model="form.score" autocomplete="off" />
        </el-form-item>
        <el-form-item label="考试日期">
          <el-date-picker v-model="form.examDate" type="date" value-format="YYYY-MM-DD HH:mm:ss" />
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
  import { examResultListPage, examResultAdd, examResultUpdate, examResultDelete } from '@/api';
  import { deepCopy } from '@/utils';

  interface FormItem {
    id: string;
    courseName: string;
    studentName: string;
    [key: string]: string;
  }

  const formLayout = { id: '', courseId: '', studentId: '', score: '', examDate: '' };
  const queryLayout = {
    courseName: '',
    studentName: '',
    pageSize: 10,
    pageNum: 1,
  };
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
    const { code, data } = await examResultListPage(unref(query));

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

    okLoading.value = true;
    try {
      const api = param.id ? examResultUpdate : examResultAdd;
      const { code, data } = await api(param);

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
          message: data.message,
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
    const { id, courseId, studentId, score, examDate } = row;
    Object.assign(form, {
      id,
      courseId,
      studentId,
      score,
      examDate,
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
          const { code, message } = await examResultDelete(row.id);

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

  function handleExport() {}
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
