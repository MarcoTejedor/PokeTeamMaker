import { C as withCtx, _ as createVNode, d as createBaseVNode, g as createTextVNode, h as createStaticVNode, m as createElementBlock, t as _plugin_vue_export_helper_default, x as resolveComponent, y as openBlock } from "./index-BW39o6bG.js";
//#region src/views/LogoutConfirmationView.vue
var _sfc_main = {
	name: "LogoutConfirmationView",
	setup() {
		return {};
	}
};
var _hoisted_1 = { class: "min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-slate-900 p-4" };
var _hoisted_2 = { class: "bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center" };
var _hoisted_3 = { class: "flex flex-col gap-4" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	const _component_router_link = resolveComponent("router-link");
	return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [
		_cache[2] || (_cache[2] = createStaticVNode("<div class=\"mb-6\" data-v-92a4a4ff><div class=\"w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4\" data-v-92a4a4ff><svg class=\"w-8 h-8 text-green-600\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" data-v-92a4a4ff><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 13l4 4L19 7\" data-v-92a4a4ff></path></svg></div><h2 class=\"text-2xl font-bold text-gray-900 mb-2\" data-v-92a4a4ff>Logged Out Successfully</h2><p class=\"text-gray-600\" data-v-92a4a4ff>You have been logged out of your account.</p></div>", 1)),
		createBaseVNode("div", _hoisted_3, [createVNode(_component_router_link, {
			to: "/login",
			class: "btn-primary py-3 text-lg font-semibold transition-transform hover:scale-105"
		}, {
			default: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode(" Log In Again ", -1)])]),
			_: 1
		}), createVNode(_component_router_link, {
			to: "/register",
			class: "px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold text-lg"
		}, {
			default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode(" Create New Account ", -1)])]),
			_: 1
		})]),
		_cache[3] || (_cache[3] = createBaseVNode("p", { class: "text-xs text-gray-500 mt-8" }, " Thank you for using PokéTeam Master AI! ", -1))
	])]);
}
var LogoutConfirmationView_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-92a4a4ff"]]);
//#endregion
export { LogoutConfirmationView_default as default };
