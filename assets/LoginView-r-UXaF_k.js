import { C as withCtx, E as toDisplayString, T as ref, _ as createVNode, a as useRouter, c as withModifiers, d as createBaseVNode, g as createTextVNode, m as createElementBlock, n as authAPI, p as createCommentVNode, s as vModelText, t as _plugin_vue_export_helper_default, v as onMounted, w as withDirectives, x as resolveComponent, y as openBlock } from "./index-BW39o6bG.js";
//#region src/views/LoginView.vue
var _sfc_main = {
	name: "LoginView",
	setup() {
		const router = useRouter();
		const form = ref({
			username: "",
			password: ""
		});
		const loading = ref(false);
		const error = ref(null);
		onMounted(() => {
			if (localStorage.getItem("userId")) router.replace("/equipos");
		});
		const handleSubmit = async () => {
			error.value = null;
			loading.value = true;
			try {
				const payload = {
					username: form.value.username,
					password: form.value.password
				};
				const res = await authAPI.login(payload);
				const userId = res.data.user_id || res.data.userId || null;
				const userName = res.data.username || res.data.user || "";
				if (userId) {
					localStorage.setItem("userId", String(userId));
					localStorage.setItem("userName", userName);
					router.push("/equipos");
				} else error.value = "Login succeeded but no user data returned.";
			} catch (err) {
				if (err.response && err.response.data) {
					const data = err.response.data;
					error.value = data.error || data.non_field_errors || JSON.stringify(data);
				} else error.value = "Network or server error. Please try again.";
			} finally {
				loading.value = false;
			}
		};
		return {
			form,
			loading,
			error,
			handleSubmit
		};
	}
};
var _hoisted_1 = { class: "min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-slate-900 p-4" };
var _hoisted_2 = { class: "bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-md w-full" };
var _hoisted_3 = {
	key: 0,
	class: "text-red-600 text-sm"
};
var _hoisted_4 = { class: "flex items-center justify-between mt-4" };
var _hoisted_5 = ["disabled"];
var _hoisted_6 = { key: 0 };
var _hoisted_7 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	const _component_router_link = resolveComponent("router-link");
	return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [
		_cache[6] || (_cache[6] = createBaseVNode("h2", { class: "text-2xl font-bold text-gray-900 mb-2" }, "Log In", -1)),
		_cache[7] || (_cache[7] = createBaseVNode("p", { class: "text-sm text-gray-600 mb-6" }, "Sign in to manage your teams and analyze strategies.", -1)),
		createBaseVNode("form", {
			onSubmit: _cache[2] || (_cache[2] = withModifiers((...args) => $setup.handleSubmit && $setup.handleSubmit(...args), ["prevent"])),
			class: "space-y-4"
		}, [
			createBaseVNode("div", null, [_cache[3] || (_cache[3] = createBaseVNode("label", {
				class: "block text-sm font-medium text-gray-700 mb-1",
				for: "username"
			}, "Username", -1)), withDirectives(createBaseVNode("input", {
				id: "username",
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.username = $event),
				type: "text",
				required: "",
				class: "input-field",
				autocomplete: "username"
			}, null, 512), [[vModelText, $setup.form.username]])]),
			createBaseVNode("div", null, [_cache[4] || (_cache[4] = createBaseVNode("label", {
				class: "block text-sm font-medium text-gray-700 mb-1",
				for: "password"
			}, "Password", -1)), withDirectives(createBaseVNode("input", {
				id: "password",
				"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.password = $event),
				type: "password",
				required: "",
				class: "input-field",
				autocomplete: "current-password"
			}, null, 512), [[vModelText, $setup.form.password]])]),
			$setup.error ? (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString($setup.error), 1)) : createCommentVNode("", true),
			createBaseVNode("div", _hoisted_4, [createBaseVNode("button", {
				type: "submit",
				class: "btn-primary px-6 py-2 text-base",
				disabled: $setup.loading
			}, [!$setup.loading ? (openBlock(), createElementBlock("span", _hoisted_6, "Log In")) : (openBlock(), createElementBlock("span", _hoisted_7, "Signing in..."))], 8, _hoisted_5), createVNode(_component_router_link, {
				to: "/register",
				class: "text-sm text-blue-600 hover:underline"
			}, {
				default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode(" Create account ", -1)])]),
				_: 1
			})])
		], 32)
	])]);
}
var LoginView_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e5a9300a"]]);
//#endregion
export { LoginView_default as default };
