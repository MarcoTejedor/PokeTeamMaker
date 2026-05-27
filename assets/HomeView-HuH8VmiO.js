import { C as withCtx, _ as createVNode, d as createBaseVNode, g as createTextVNode, m as createElementBlock, t as _plugin_vue_export_helper_default, x as resolveComponent, y as openBlock } from "./index-DkkCPkP6.js";
//#region src/views/HomeView.vue
var _sfc_main = {
	name: "HomeView",
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
		_cache[2] || (_cache[2] = createBaseVNode("h1", { class: "text-4xl md:text-5xl font-bold text-gray-900 mb-2" }, " PokéTeam Master AI ", -1)),
		_cache[3] || (_cache[3] = createBaseVNode("div", { class: "h-1 w-16 bg-red-600 mx-auto mb-6 rounded" }, null, -1)),
		_cache[4] || (_cache[4] = createBaseVNode("p", { class: "text-lg text-gray-600 mb-8" }, " Build, manage, and analyze your ultimate competitive Pokémon team. ", -1)),
		createBaseVNode("div", _hoisted_3, [createVNode(_component_router_link, {
			to: "/login",
			class: "btn-primary py-3 text-lg font-semibold transition-transform hover:scale-105"
		}, {
			default: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode(" Log In ", -1)])]),
			_: 1
		}), createVNode(_component_router_link, {
			to: "/register",
			class: "px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold text-lg"
		}, {
			default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode(" Sign Up ", -1)])]),
			_: 1
		})]),
		_cache[5] || (_cache[5] = createBaseVNode("p", { class: "text-xs text-gray-500 mt-8" }, " Built with Vue.js, Django, and the PokéAPI ", -1))
	])]);
}
var HomeView_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c6534c6e"]]);
//#endregion
export { HomeView_default as default };
