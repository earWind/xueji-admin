<template>
  <div class="main">
    <el-card class="search-box">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="班级名称">
          <el-input
            v-model="query.className"
            placeholder="请输入班级名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="班主任姓名">
          <el-input
            v-model="query.headTeacherName"
            placeholder="请输入班主任姓名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="专业名称">
          <el-input
            v-model="query.majorName"
            placeholder="请输入专业名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="query.name" placeholder="请输入姓名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="学号">
          <el-input
            v-model="query.studentNo"
            placeholder="请输入学号"
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
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="studentNo" label="学号" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="className" label="班级名称" width="180" />
        <el-table-column prop="headTeacherName" label="班主任姓名" />
        <el-table-column prop="majorName" label="专业名称" />
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
      :title="(form.id ? '修改' : '新增') + '学生'"
      width="600"
    >
      <el-form :model="form" label-width="100">
        <el-form-item label="姓名">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.studentNo" autocomplete="off" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="form.birthday" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="form.classId">
            <el-option
              v-for="item in classOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入学情况">
          <el-input v-model="form.entranceDescr" autocomplete="off" type="textarea" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="毕业情况">
          <el-input v-model="form.graduateDescr" autocomplete="off" type="textarea" />
        </el-form-item>
        <el-form-item label="班主任">
          <el-select v-model="form.headTeacherId">
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="form.majorId">
            <el-option
              v-for="item in majorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实习情况">
          <el-input v-model="form.practiceDescr" autocomplete="off" type="textarea" />
        </el-form-item>
        <el-form-item label="学籍异动情况">
          <el-input v-model="form.rollChangeDescr" autocomplete="off" type="textarea" />
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
    studentListPage,
    studentAdd,
    studentUpdate,
    studentDelete,
    studentDetail,
    majorListPage,
    userListPage,
    classListPage,
  } from '@/api';
  import { deepCopy } from '@/utils';
  import { useUserStore } from '@/store/modules/user';

  interface FormItem {
    id: string;
    className: string;
    gender: string;
    headTeacherName: string;
    majorName: string;
    name: string;
    studentNo: string;
    [key: string]: string;
  }

  const formLayout = {
    id: '',
    birthday: '',
    classId: '',
    entranceDescr: '',
    gender: '',
    graduateDescr: '',
    headTeacherId: '',
    majorId: '',
    name: '',
    practiceDescr: '',
    rollChangeDescr: '',
    studentNo: '',
  };
  const queryLayout = {
    className: '',
    headTeacherName: '',
    majorName: '',
    name: '',
    studentNo: '',
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
  const majorOptions = ref([]);
  const userOptions = ref([]);
  const classOptions = ref([]);
  const genderOptions = [
    {
      label: '女',
      value: 1,
    },
    {
      label: '男',
      value: 2,
    },
  ];

  onMounted(() => {
    queryList();
    queryMajorListPage();
    queryUserListPage();
    queryClassListPage();
  });

  async function queryList() {
    const { code, data } = await studentListPage(unref(query));

    if (code === 200) {
      tableData.value = data.records;
      total.value = data.total;
    }
  }

  async function queryMajorListPage() {
    const { code, data } = await majorListPage({ pageSize: 9999, pageNum: 1 });

    if (code === 200) {
      majorOptions.value = data.records.map((item) => {
        return {
          label: item.majorName,
          value: item.id,
        };
      });
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

  async function queryClassListPage() {
    const { code, data } = await classListPage({ pageSize: 9999, pageNum: 1 });

    if (code === 200) {
      classOptions.value = data.records.map((item) => {
        return {
          label: item.className,
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
      const api = param.id ? studentUpdate : studentAdd;
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

  async function handleEdit(row: FormItem) {
    const { code, data } = await studentDetail({ id: row.id });

    if (code === 200) {
      const {
        id,
        birthday,
        entranceDescr,
        gender,
        graduateDescr,
        headTeacherName,
        majorName,
        className,
        name,
        practiceDescr,
        rollChangeDescr,
        studentNo,
      } = data;
      Object.assign(form, {
        id,
        birthday,
        entranceDescr,
        graduateDescr,
        name,
        practiceDescr,
        rollChangeDescr,
        studentNo,
      });

      unref(majorOptions).forEach((item) => {
        if (item.label === majorName) {
          form.majorId = item.value;
        }
      });

      unref(userOptions).forEach((item) => {
        if (item.label === headTeacherName) {
          form.headTeacherId = item.value;
        }
      });

      unref(classOptions).forEach((item) => {
        if (item.label === className) {
          form.classId = item.value;
        }
      });

      unref(genderOptions).forEach((item) => {
        if (item.label === gender) {
          form.gender = item.value;
        }
      });

      dialogFormVisible.value = true;
    }
  }

  async function handleDelete(row: FormItem) {
    ElMessageBox.confirm('是否删除?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          const { code, message } = await studentDelete(row.id);

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
