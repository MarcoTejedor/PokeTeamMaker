import { T as ref, m as createElementBlock, p as createCommentVNode, t as _plugin_vue_export_helper_default, v as onMounted, y as openBlock } from "./index-BW39o6bG.js";
//#region src/components/TypeIcon.vue
var POKEAPI = "https://pokeapi.co/api/v2";
var TYPE_ICON_CACHE = "pokeapi_type_icons";
var _sfc_main = {
	name: "TypeIcon",
	props: { type: {
		type: String,
		required: true
	} },
	setup(props) {
		const iconUrl = ref(null);
		const loading = ref(true);
		const hasError = ref(false);
		async function fetchTypeIcon() {
			try {
				const cached = localStorage.getItem(TYPE_ICON_CACHE);
				let typeIcons = cached ? JSON.parse(cached) : {};
				if (typeIcons[props.type]) {
					iconUrl.value = typeIcons[props.type];
					loading.value = false;
					return;
				}
				const res = await fetch(`${POKEAPI}/type/${props.type}`);
				if (!res.ok) throw new Error("Type not found");
				const data = await res.json();
				const url = data.sprites?.["generation-ix"]?.["scarlet-violet"]?.name_icon || data.sprites?.["generation-viii"]?.["sword-shield"]?.name_icon || data.sprites?.["generation-vii"]?.["ultra-sun-ultra-moon"]?.name_icon;
				if (url) {
					iconUrl.value = url;
					typeIcons[props.type] = url;
					localStorage.setItem(TYPE_ICON_CACHE, JSON.stringify(typeIcons));
				}
			} catch (err) {
				console.error(`Failed to load type icon for ${props.type}:`, err);
				hasError.value = true;
			} finally {
				loading.value = false;
			}
		}
		function onLoad() {}
		function onError() {
			hasError.value = true;
		}
		onMounted(() => {
			fetchTypeIcon();
		});
		return {
			iconUrl,
			loading,
			hasError,
			onLoad,
			onError
		};
	}
};
var _hoisted_1 = { class: "inline-flex items-center" };
var _hoisted_2 = ["src", "alt"];
var _hoisted_3 = {
	key: 1,
	class: "h-20 w-20 bg-slate-200 rounded animate-pulse"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createElementBlock("span", _hoisted_1, [$setup.iconUrl ? (openBlock(), createElementBlock("img", {
		key: 0,
		src: $setup.iconUrl,
		alt: $props.type,
		class: "h-10 w-20 object-contain",
		onError: _cache[0] || (_cache[0] = (...args) => $setup.onError && $setup.onError(...args)),
		onLoad: _cache[1] || (_cache[1] = (...args) => $setup.onLoad && $setup.onLoad(...args))
	}, null, 40, _hoisted_2)) : $setup.loading ? (openBlock(), createElementBlock("span", _hoisted_3)) : createCommentVNode("", true)]);
}
var TypeIcon_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render]]);
//#endregion
export { TypeIcon_default as t };
