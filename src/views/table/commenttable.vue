<template>
	<div>
		<TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
		<div class="container">
			<TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
				:delFunc="handleDelete" :editFunc="handleEdit" :refresh="getData" :currentPage="page.index"
				:changePage="changePage" :page-size="page.size">
				<template #toolbarBtn>
					<el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
				</template>
				<template #money="{ rows }">
					￥{{ rows.money }}
				</template>
				<template #thumb="{ rows }">
					<el-image class="table-td-thumb" :src="rows.thumb" :z-index="10" :preview-src-list="[rows.thumb]"
						preview-teleported>
					</el-image>
				</template>
				<template #state="{ rows }">
					<el-tag :type="rows.state ? 'success' : 'danger'">
						{{ rows.state ? '正常' : '异常' }}
					</el-tag>
				</template>
			</TableCustom>
		</div>

		<el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
			:close-on-click-modal="false" @close="closeDialog">
			<TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData">
				<!-- <template #thumb="{ rows }">
					<img class="table-td-thumb" :src="rows.thumb"></img>
				</template> -->
			</TableEdit>
		</el-dialog>

		<el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
			<TableDetail :data="viewData">
				<template #thumb="{ rows }">
					<el-image :src="rows.thumb"></el-image>
				</template>
			</TableDetail>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, } from 'element-plus';
import { CirclePlusFilled, Refresh } from '@element-plus/icons-vue';
import TableCustom from '@/components/comment_table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import TableEdit from '@/components/comment_table-edit.vue';
import { CommentItem } from '@/types/comment';
import { FormOption, FormOptionList } from '@/types/form-option';
import { getRequest, deleteRequest } from '@/api/admin';
import { ElMessageBox } from 'element-plus';

// 查询相关
const query = reactive({
	name: '',
});
const searchOpt = ref<FormOptionList[]>([
	{ type: 'input', label: '用户名：', prop: 'name' }
])
const handleSearch = () => {
	changePage(1);
};

// 表格相关
let columns = ref([
	{ type: 'selection' },
	{ prop: 'commentid', label: '评论id', width: 55, align: 'center' },
	{ prop: 'userid', label: '用户id' },
	{ prop: 'competitionid', label: '竞赛id' },
	{ prop: 'commenttext', label: '评论内容' },
	{ prop: 'isapproved', label: '是否审核' },
	{ prop: 'createdat', label: '创建时间' },
	{ prop: 'approvedBy', label: '审核人id', width: 100 },
	{ prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
	index: 1,
	size: 20,
	total: 20,
})
let tableData = ref<CommentItem[]>([]);


// 查询所有评论数据
const getData = async () => {
	let adminData = ref(null);

	const token = localStorage.getItem('token'); 

	const headers = {
      'Authorization': token,
      'Content-Type': 'application/json',
    };
	const params = {
		pageNum: 1,
		pageSize: 15,
	};

	const getAllCommentData = async () => {
		try {
			const result = await getRequest('/contest_ment/getcomments', params, headers); // 传递查询参数
			console.log('查询请求成功:', result);
			adminData.value = result;

			tableData.value = result.data.items;
			page.total = result.data.total;
			console.log('tableData:', tableData.value)

		} catch (error) {
			console.error('请求失败:', error);
		}
	};

	getAllCommentData();
};

// 调用 getData 时传入查询参数
getData();

const changePage = (val: number) => {
	page.index = val;
	getData();
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
	labelWidth: '100px',
	span: 24,
	list: [
		{ type: 'number', prop: 'commentid', label: '评论id'},
		{ type: 'number', prop: 'userid', label: '用户id' },
		{ type: 'number', prop: 'competitionid', label: '竞赛id' },
		{ type: 'input', prop: 'commenttext', label: '评论内容' },
		{ type: 'number', prop: 'isapproved', label: '是否审核' },
		{ type: 'number', prop: 'createdat', label: '创建时间' },
		{ type: 'number', prop: 'approvedBy', label: '审核人id'},
	]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: CommentItem) => {
	rowData.value = { ...row };
	isEdit.value = true;
	visible.value = true;
};
const updateData = () => {
	closeDialog();
	getData();
};

const closeDialog = () => {
	visible.value = false;
	isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
	row: {},
	list: []
});
const handleView = (row: CommentItem) => {
	viewData.value.row = { ...row }
	viewData.value.list = [
	{
			prop: 'commentid',
			label: '评论id'
		},
		{
			prop: 'userid',
			label: '用户ID',
		},
		{
			prop: 'competitionid',
			label: '竞赛id',
		},
		{
			prop: 'commenttext',
			label: '评论内容',
		},
		{
			prop: 'createdat',
			label: '创建时间',
		},
		{
			prop: 'isapproved',
			label: '是否审核',
		},
		{
			prop: 'approvedBy ',
			label: '审核人id',
		},

	]
	visible1.value = true;
};

// 删除相关
const handleDelete = (row: CommentItem) => {
	ElMessage.success('删除成功');
	console.log('row', row)
	const commentid = row.commentid;
	let adminData = ref(null);

	const token = localStorage.getItem('token');

	console.log('token',token);

	const headers = {
      'Authorization': token,
      'Content-Type': 'application/json',
    };
	const params = { commentid: commentid };

	const deleteAdminData = async () => {
		try {
			const result = await deleteRequest('/contest_ment/delete', params, headers); // 传递查询参数
			console.log('删除请求成功:', result);
			ElMessageBox.confirm('评论删除成功')
			adminData.value = result;
			getData();
		} catch (error) {
			console.error('请求失败:', error);
		}
	};

	deleteAdminData();
	
}
</script>

<style scoped>
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>
