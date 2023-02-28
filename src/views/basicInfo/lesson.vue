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
        <el-form-item label="课程号">
          <el-input
            v-model="query.courseNo"
            placeholder="请输入课程号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="任课老师姓名">
          <el-input
            v-model="query.teacherName"
            placeholder="请输入任课老师姓名"
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
        <el-table-column prop="courseName" label="课程名称" width="180" />
        <el-table-column prop="courseNo" label="课程号" />
        <el-table-column prop="courseType" label="课程类型" />
        <el-table-column prop="courseDescr" label="课程介绍" />
        <el-table-column prop="credit" label="学分" />
        <el-table-column prop="period" label="学时" />
        <el-table-column prop="teacherName" label="任课老师姓名" />
        <el-table-column prop="testType" label="考试形式" />

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
      :title="(form.id ? '修改' : '新增') + '课程'"
      width="600"
    >
      <el-form :model="form" label-width="100">
        <el-form-item label="课程名称">
          <el-input v-model="form.courseName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程号">
          <el-input v-model="form.courseNo" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程类型">
          <el-input v-model="form.courseType" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程介绍">
          <el-input v-model="form.courseDescr" autocomplete="off" type="textarea" />
        </el-form-item>
        <el-form-item label="学分">
          <el-input v-model="form.credit" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学时">
          <el-input v-model="form.period" autocomplete="off" />
        </el-form-item>
        <el-form-item label="任课老师">
          <el-select v-model="form.teacherId">
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试形式">
          <el-input v-model="form.testType" autocomplete="off" />
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
  import { courseListPage, courseAdd, courseUpdate, courseDelete, userListPage } from '@/api';
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

  const formLayout = {
    id: '',
    courseName: '',
    courseNo: '',
    courseType: '',
    courseDescr: '',
    credit: '',
    period: '',
    teacherName: '',
    testType: '',
  };
  const queryLayout = {
    courseName: '',
    courseNo: '',
    teacherName: '',
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
  const userOptions = ref([]);

  onMounted(() => {
    queryList();
    queryUserListPage();
  });

  async function queryList() {
    const { code, data } = await courseListPage(unref(query));

    if (code === 200) {
      tableData.value = data.records;
      total.value = data.total;
    }
  }

  async function queryUserListPage() {
    const { code, data } = await userListPage({ pageSize: 9999, pageNum: 1 });

    if (code === 200) {
      userOptions.value = data.records.map((item) => {
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
      const api = param.id ? courseUpdate : courseAdd;
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
    const {
      id,
      courseName,
      courseNo,
      courseType,
      courseDescr,
      credit,
      period,
      teacherName,
      testType,
    } = row;
    Object.assign(form, {
      id,
      courseName,
      courseNo,
      courseType,
      courseDescr,
      credit,
      period,
      testType,
    });

    unref(userOptions).forEach((item) => {
      if (item.label === teacherName) {
        form.teacherId = item.value;
      }
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
          const { code, message } = await courseDelete(row.id);

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
