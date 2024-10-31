<template>
  <Form @submit="submitContact" :validation-schema="contactFormSchema">
    <div class="form-group">
      <label for="name">Tên</label>
      <Field id="name" name="name" type="text" class="form-control" v-model="contactLocal.name" required />
      <ErrorMessage name="name" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="email">E-mail</label>
      <Field id="email" name="email" type="email" class="form-control" v-model="contactLocal.email" required />
      <ErrorMessage name="email" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="address">Địa chỉ</label>
      <Field id="address" name="address" type="text" class="form-control" v-model="contactLocal.address" />
      <ErrorMessage name="address" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="phone">Điện thoại</label>
      <Field id="phone" name="phone" type="tel" class="form-control" v-model="contactLocal.phone" required />
      <ErrorMessage name="phone" class="error-feedback" />
    </div>
    <div class="form-group form-check">
      <Field id="favorite" name="favorite" type="checkbox" class="form-check-input" v-model="contactLocal.favorite" />
      <label for="favorite" class="form-check-label"><strong>Liên hệ yêu thích</strong></label>
    </div>
    <div class="form-group">
      <button class="btn btn-primary">Lưu</button>
      <button v-if="contactLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteContact">Xóa</button>
      <button type="button" class="ml-2 btn btn-danger" @click="Cancel">Thoát</button>
    </div>
    <p v-if="errorMessage" class="error-feedback">{{ errorMessage }}</p>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:contact", "delete:contact"],
  props: {
    contact: { type: Object, required: true },
  },
  data() {
    const contactFormSchema = yup.object().shape({
      name: yup.string().required("Tên phải có giá trị.").min(2).max(50),
      email: yup.string().email("E-mail không đúng.").max(50),
      address: yup.string().max(100),
      phone: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Số điện thoại không hợp lệ."),
    });

    return {
      contactLocal: { ...this.contact },
      contactFormSchema,
      errorMessage: "",
    };
  },
  methods: {
    async submitContact() {
      this.errorMessage = "";
      try {
        await this.$emit("submit:contact", this.contactLocal);
        this.contactLocal = { ...this.contact }; 
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi gửi dữ liệu.";
      }
    },
    deleteContact() {
      this.$emit("delete:contact", this.contactLocal._id);
    },
    Cancel() {
      const reply = window.confirm('Bạn có chắc muốn rời khỏi trang?');
      if (reply) {
        this.$router.push({ name: "contactbook" });
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
