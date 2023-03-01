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
          <el-button type="primary" @click="downloadFile">下载模板</el-button>
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
          <el-select v-model="form.studentId">
            <el-option
              v-for="item in studentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程">
          <el-select v-model="form.courseId">
            <el-option
              v-for="item in courseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分数">
          <el-input-number v-model="form.score" :min="0" :max="100" autocomplete="off" />
        </el-form-item>
        <el-form-item label="考试日期">
          <el-date-picker v-model="form.examDate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel">取消</el-button>
          <el-button type="primary" :loading="okLoading" @click="editOk">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogImportVisible" title="导入" width="600" @close="cancelUpload">
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        action="#"
        accept=".xls,.xlsx"
        :auto-upload="false"
        :on-change="onFileChange"
        :limit="1"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖动文件或者<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传excel文件</div>
        </template>
      </el-upload>

      <template #footer>
        <el-button @click="cancelUpload">取消</el-button>
        <el-button type="primary" @click="okUpload">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, unref, onMounted } from 'vue';
  import { UploadFilled } from '@element-plus/icons-vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import {
    examResultListPage,
    examResultAdd,
    examResultUpdate,
    examResultDelete,
    studentListPage,
    courseListPage,
    examResultAddBatch,
  } from '@/api';
  import { deepCopy } from '@/utils';
  import { useUserStore } from '@/store/modules/user';
  import * as xlsx from 'xlsx';

  interface FormItem {
    id: string;
    courseName: string;
    studentName: string;
    [key: string]: string;
  }

  const formLayout = { id: '', courseId: '', studentId: '', score: 0, examDate: '' };
  const queryLayout = {
    courseName: '',
    studentName: '',
    pageSize: 10,
    pageNum: 1,
  };
  const userStore = useUserStore();
  const tableData = ref<FormItem[]>([]);
  const query = reactive(deepCopy(queryLayout));
  const dialogFormVisible = ref(false);
  const dialogImportVisible = ref(false);
  const form = reactive(deepCopy(formLayout));
  const total = ref(0);
  const okLoading = ref(false);
  const studentOptions = ref([]);
  const courseOptions = ref([]);
  let file = null;
  const upload = ref();

  onMounted(() => {
    queryList();
    queryStudentList();
    queryCourseListPage();
  });

  async function queryList() {
    const { code, data } = await examResultListPage(unref(query));

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

  async function queryCourseListPage() {
    const { code, data } = await courseListPage({ pageSize: 9999, pageNum: 1 });

    if (code === 200) {
      courseOptions.value = data.records.map((item) => {
        return {
          label: item.courseName,
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
      const api = param.id ? examResultUpdate : examResultAdd;
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
    const { id, courseName, studentName, score, examDate } = row;

    Object.assign(form, {
      id,
      score,
      examDate,
    });

    unref(studentOptions).forEach((item) => {
      if (item.label === studentName) {
        form.studentId = item.value;
      }
    });

    unref(courseOptions).forEach((item) => {
      if (item.label === courseName) {
        form.courseId = item.value;
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

  // 导入
  function handleExport() {
    dialogImportVisible.value = true;
  }

  function onFileChange(data) {
    file = data;
  }

  // 取消上传
  function cancelUpload() {
    dialogImportVisible.value = false;
    file = null;
    unref(upload)?.clearFiles?.();
  }

  async function okUpload() {
    /**
     * 1. 使用原生api去读取好的文件
     */
    // 读取文件不是立马能够读取到的，所以是异步的，使用Promise
    const dataBinary = await new Promise((resolve) => {
      // Web API构造函数FileReader，可实例化对象，去调用其身上方法，去读取解析文件信息
      const reader = new FileReader(); // https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
      reader.readAsBinaryString(file.raw); // 读取raw的File文件
      reader.onload = (ev) => {
        resolve(ev.target.result); // 将解析好的结果扔出去，以供使用
      };
    });

    /**
     * 2. 使用xlsx插件去解析已经读取好的二进制excel流文件
     */
    const workBook = xlsx.read(dataBinary, { type: 'binary', cellDates: true });
    // excel中有很多的sheet，这里取了第一个sheet：workBook.SheetNames[0]
    const firstWorkSheet = workBook.Sheets[workBook.SheetNames[0]];
    // 分为第一行的数据，和第一行下方的数据
    const header = getHeaderRow(firstWorkSheet);
    console.log('读取的excel表头数据（第一行）', header);
    const xlsxData = xlsx.utils.sheet_to_json(firstWorkSheet);
    console.log('读取所有excel数据', xlsxData);

    const fields = {
      课程编号: 'courseNo',
      考试日期: 'examDate',
      分数: 'score',
      学生学号: 'studentNo',
    };
    const examResults = xlsxData.map((item) => {
      const ret = {};
      Object.keys(item).forEach((key) => {
        ret[fields[key]] = item[key];
      });
      return ret;
    });

    try {
      const { code, message } = await examResultAddBatch({
        examResults,
        operatorId: userStore.userId,
      });

      if (code === 200) {
        ElMessage({
          type: 'success',
          message: '操作成功',
        });
        cancelUpload();
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
  }

  function getHeaderRow(sheet) {
    const headers = []; // 定义数组，用于存放解析好的数据
    const range = xlsx.utils.decode_range(sheet['!ref']); // 读取sheet的单元格数据
    let C;
    const R = range.s.r;
    /* start in the first row */
    for (C = range.s.c; C <= range.e.c; ++C) {
      /* walk every column in the range */
      const cell = sheet[xlsx.utils.encode_cell({ c: C, r: R })];
      /* find the cell in the first row */
      let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
      if (cell && cell.t) hdr = xlsx.utils.format_cell(cell);
      headers.push(hdr);
    }
    return headers; // 经过上方一波操作遍历，得到最终的第一行头数据
  }

  // 下载模板
  function downloadFile() {
    const xlsxData = [['课程编号', '考试日期', '分数', '学生学号']];
    const worksheet = xlsx.utils.aoa_to_sheet(xlsxData);
    const workBook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workBook, worksheet); // 第三个参数可选，是工作表名称
    xlsx.writeFile(workBook, '考试成绩模板.xlsx'); // 第二个参数的后缀名有其他格式可供选择（xls, csv）
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
