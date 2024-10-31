import { createWebHistory, createRouter } from "vue-router";
import ContactBook from "@/views/ContactBook.vue";

const routes = [
  {
    path: "/",
    name: "contactbook",
    component: ContactBook,
    meta: { title: 'Danh bạ' }, // Thêm metadata
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
    meta: { title: 'Không tìm thấy' }, // Thêm metadata
  },
  {
    path: "/contacts/:id",
    name: "contact.edit",
    component: () => import("@/views/ContactEdit.vue"),
    props: true // Truyền các biến trong $route.params vào làm props
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Tùy chọn: Global navigation guard để xử lý lỗi
router.beforeEach((to, from, next) => {
  // Thay đổi tiêu đề trang dựa trên metadata
  document.title = to.meta.title || 'Trang mặc định';

  // Thêm logic kiểm soát truy cập route hoặc ghi nhật ký nếu cần
  next();
});

// Tùy chọn: Scroll behavior
router.scrollBehavior = () => {
  return { top: 0 }; // Cuộn về đầu trang khi chuyển route
};

export default router;
