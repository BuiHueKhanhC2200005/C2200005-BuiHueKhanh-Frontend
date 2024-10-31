<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>
      <ContactList
        v-if="filteredContactsCount > 0"
        :contacts="filteredContacts"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có liên hệ nào.</p>
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList">
          <i class="fas fa-redo"></i> Làm mới
        </button>
        <button class="btn btn-sm btn-success" @click="goToAddContact">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
        <button class="btn btn-sm btn-danger" @click="confirmRemoveAllContacts">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="activeContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="activeContact" />
        <router-link
          :to="{
            name: 'contact.edit',
            params: { id: activeContact._id },
          }"
        >
          <span class="mt-2 badge badge-edit">
            <i class="fas fa-edit"></i> Hiệu chỉnh
          </span>
        </router-link>
      </div>
    </div>
    <div v-if="isLoading">
      <i class="fas fa-spinner fa-spin"></i> Đang tải danh bạ...
    </div>
  </div>
</template>

<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";
import { computed } from "vue";

export default {
  components: {
    ContactCard,
    InputSearch,
    ContactList,
  },
  data() {
    return {
      contacts: [],
      activeIndex: -1,
      searchText: "",
      isLoading: false,
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    contactStrings() {
      return this.contacts.map((contact) => {
        const { name, email, address, phone } = contact;
        return [name, email, address, phone].join("");
      });
    },
    filteredContacts() {
      if (!this.searchText) return this.contacts;
      return this.contacts.filter((_contact, index) =>
        this.contactStrings[index].includes(this.searchText)
      );
    },
    activeContact() {
      if (this.activeIndex < 0) return null;
      return this.filteredContacts[this.activeIndex];
    },
    filteredContactsCount() {
      return this.filteredContacts.length;
    },
  },
  methods: {
    async retrieveContacts() {
      this.isLoading = true;
      try {
        this.contacts = await ContactService.getAll();
      } catch (error) {
        this.handleError("Lỗi khi tải danh bạ. Vui lòng thử lại.");
      } finally {
        this.isLoading = false;
      }
    },
    refreshList() {
      this.retrieveContacts();
      this.activeIndex = -1;
    },
    async confirmRemoveAllContacts() {
      if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
        this.removeAllContacts();
      }
    },
    async removeAllContacts() {
      try {
        await ContactService.deleteAll();
        alert("Đã xóa tất cả liên hệ."); // Thông báo thành công
        this.refreshList();
      } catch (error) {
        this.handleError("Lỗi khi xóa danh bạ. Vui lòng thử lại.");
      }
    },
    goToAddContact() {
      this.$router.push({ name: "contact.add" });
    },
    handleError(message) {
      alert(message); // Có thể thay thế bằng một modal hoặc thông báo tốt hơn
      console.error(message);
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}

.badge-edit {
  background-color: #007bff; /* Màu xanh */
  color: white; /* Màu chữ trắng */
  padding: 0.5rem 1rem; /* Thêm padding nếu cần */
  border-radius: 0.25rem; /* Tạo góc tròn */
  text-decoration: none; /* Bỏ gạch chân nếu có */
}

/* Không cần hiệu ứng hover */
.badge-edit:hover {
  background-color: #007bff; /* Giữ nguyên màu khi hover */
}
</style>

