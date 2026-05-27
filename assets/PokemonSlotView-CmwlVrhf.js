import { C as withCtx, E as toDisplayString, S as watch, T as ref, _ as createVNode, a as useRouter, b as renderList, d as createBaseVNode, f as createBlock, g as createTextVNode, i as useRoute, l as Fragment, m as createElementBlock, o as vModelSelect, p as createCommentVNode, r as teamsAPI, s as vModelText, t as _plugin_vue_export_helper_default, v as onMounted, w as withDirectives, x as resolveComponent, y as openBlock } from "./index-BW39o6bG.js";
import { t as TypeIcon_default } from "./TypeIcon-DUBbVdom.js";
//#region src/views/PokemonSlotView.vue
var POKEAPI = "https://pokeapi.co/api/v2";
var _sfc_main = {
	name: "PokemonSlotView",
	components: { TypeIcon: TypeIcon_default },
	setup() {
		const route = useRoute();
		const router = useRouter();
		const teamId = route.params.id;
		const teamName = ref("");
		const searchTerm = ref("");
		const showResults = ref(false);
		const loading = ref(false);
		const error = ref(null);
		const speciesList = ref([]);
		const filteredResults = ref([]);
		const selectedSpecies = ref(null);
		const forms = ref([]);
		const selectedForm = ref("");
		const pokemonDetail = ref(null);
		const assigning = ref(false);
		const assignSuccess = ref("");
		const assignError = ref("");
		const selectedGeneration = ref("");
		const generations = ref([]);
		async function loadSpeciesList() {
			const cached = localStorage.getItem("pokedex_species");
			if (cached) {
				speciesList.value = JSON.parse(cached);
				return;
			}
			try {
				loading.value = true;
				speciesList.value = (await (await fetch(`${POKEAPI}/pokemon?limit=2000`)).json()).results || [];
				localStorage.setItem("pokedex_species", JSON.stringify(speciesList.value));
			} catch (err) {
				console.error(err);
			} finally {
				loading.value = false;
			}
		}
		async function loadGenerations() {
			try {
				generations.value = (await (await fetch(`${POKEAPI}/generation`)).json()).results || [];
			} catch (e) {}
		}
		async function onSearchInput() {
			showResults.value = true;
			const q = searchTerm.value.trim().toLowerCase();
			if (!q) {
				filteredResults.value = [];
				return;
			}
			let list = speciesList.value;
			if (selectedGeneration.value) {
				try {
					const targetGen = (await (await fetch(selectedGeneration.value)).json()).id;
					const allowedSpecies = /* @__PURE__ */ new Set();
					for (let g = 1; g <= targetGen; g++) ((await (await fetch(`${POKEAPI}/generation/${g}`)).json()).pokemon_species || []).forEach((s) => allowedSpecies.add(s.name));
					filteredResults.value = list.filter((s) => s.name.includes(q) && allowedSpecies.has(s.name));
				} catch (err) {
					console.error("Failed to filter by generation:", err);
					filteredResults.value = list.filter((s) => s.name.includes(q));
				}
				return;
			}
			filteredResults.value = list.filter((s) => s.name.includes(q));
		}
		function selectSpecies(item) {
			selectedSpecies.value = item;
			showResults.value = false;
			searchTerm.value = item.name;
			loadFormsForSpecies(item.name);
		}
		async function loadFormsForSpecies(speciesName) {
			loading.value = true;
			selectedForm.value = "";
			forms.value = [];
			pokemonDetail.value = null;
			try {
				const varieties = (await fetch(`${POKEAPI}/pokemon-species/${speciesName}`).then((r) => r.json())).varieties || [];
				if (varieties.length <= 1) {
					const p = await fetch(`${POKEAPI}/pokemon/${speciesName}`).then((r) => r.json());
					pokemonDetail.value = transformPokemonDetail(p);
					forms.value = [{
						name: p.name,
						url: `${POKEAPI}/pokemon/${p.name}`
					}];
					selectedForm.value = p.name;
				} else {
					forms.value = varieties.map((v) => ({
						name: v.pokemon.name,
						url: v.pokemon.url
					}));
					selectedForm.value = forms.value[0].name;
					pokemonDetail.value = transformPokemonDetail(await fetch(forms.value[0].url).then((r) => r.json()));
				}
			} catch (err) {
				error.value = "Failed to load species/forms.";
			} finally {
				loading.value = false;
			}
		}
		async function onGenerationChange() {
			onSearchInput();
		}
		watch(selectedForm, async (val) => {
			if (!val) return;
			try {
				pokemonDetail.value = transformPokemonDetail(await fetch(`${POKEAPI}/pokemon/${val}`).then((r) => r.json()));
			} catch (e) {}
		});
		function transformPokemonDetail(p) {
			return {
				id: p.id,
				name: p.name,
				pokedex_id: p.id,
				types: p.types.map((t) => t.type.name),
				sprites: {
					front_default: p.sprites.front_default,
					front_female: p.sprites.front_female,
					back_default: p.sprites.back_default
				},
				stats: p.stats.reduce((acc, s) => {
					acc[s.stat.name] = s.base_stat;
					return acc;
				}, {})
			};
		}
		function clearSelection() {
			selectedSpecies.value = null;
			pokemonDetail.value = null;
			forms.value = [];
			searchTerm.value = "";
		}
		async function assignSelected() {
			if (!pokemonDetail.value) return;
			assigning.value = true;
			assignSuccess.value = "";
			assignError.value = "";
			try {
				const position = Number(route.params.m);
				await teamsAPI.assignSlot(teamId, position, {
					pokedex_id: pokemonDetail.value.pokedex_id,
					name: pokemonDetail.value.name,
					types: pokemonDetail.value.types,
					sprites: pokemonDetail.value.sprites,
					stats: pokemonDetail.value.stats
				});
				assignSuccess.value = `${pokemonDetail.value.name} assigned. Redirecting...`;
				setTimeout(() => router.push(`/equipos/${teamId}`), 700);
			} catch (err) {
				assignError.value = err.response?.data?.error || "Failed to assign Pokémon.";
			} finally {
				assigning.value = false;
			}
		}
		async function loadTeamName() {
			try {
				teamName.value = (await teamsAPI.getDetail(teamId)).data.name;
			} catch (e) {}
		}
		onMounted(() => {
			loadSpeciesList();
			loadGenerations();
			loadTeamName();
		});
		return {
			teamId,
			teamName,
			searchTerm,
			selectedSpecies,
			pokemonDetail,
			loading,
			error,
			filteredResults,
			showResults,
			onSearchInput,
			selectSpecies,
			forms,
			selectedForm,
			assignSelected,
			assigning,
			assignSuccess,
			assignError,
			clearSelection,
			generations,
			selectedGeneration,
			onGenerationChange
		};
	}
};
var _hoisted_1 = { class: "min-h-screen bg-slate-50 py-10 px-4" };
var _hoisted_2 = { class: "max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-10" };
var _hoisted_3 = { class: "flex items-center justify-between mb-6" };
var _hoisted_4 = { class: "text-2xl font-bold" };
var _hoisted_5 = { class: "grid gap-4 sm:grid-cols-3 mb-4 items-center" };
var _hoisted_6 = { class: "sm:col-span-2" };
var _hoisted_7 = {
	key: 0,
	class: "border rounded mt-2 max-h-48 overflow-auto bg-white"
};
var _hoisted_8 = ["onClick"];
var _hoisted_9 = { class: "capitalize" };
var _hoisted_10 = { class: "text-gray-400" };
var _hoisted_11 = ["value"];
var _hoisted_12 = {
	key: 0,
	class: "text-center py-10 text-gray-600"
};
var _hoisted_13 = {
	key: 1,
	class: "rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 mb-6"
};
var _hoisted_14 = { key: 2 };
var _hoisted_15 = { class: "mb-4" };
var _hoisted_16 = { class: "text-xl font-semibold capitalize" };
var _hoisted_17 = {
	key: 0,
	class: "mb-4"
};
var _hoisted_18 = ["value"];
var _hoisted_19 = {
	key: 1,
	class: "grid gap-4 lg:grid-cols-2"
};
var _hoisted_20 = { class: "rounded-3xl border p-6 bg-slate-50" };
var _hoisted_21 = ["src"];
var _hoisted_22 = { class: "text-center" };
var _hoisted_23 = { class: "text-lg font-bold" };
var _hoisted_24 = { class: "text-sm text-gray-600" };
var _hoisted_25 = { class: "mt-3 flex gap-2 items-center justify-center flex-wrap" };
var _hoisted_26 = { class: "rounded-3xl border p-6 bg-white" };
var _hoisted_27 = { class: "flex gap-3" };
var _hoisted_28 = ["disabled"];
var _hoisted_29 = {
	key: 0,
	class: "mt-4 text-green-700 bg-green-50 p-3 rounded"
};
var _hoisted_30 = {
	key: 1,
	class: "mt-4 text-red-700 bg-red-50 p-3 rounded"
};
var _hoisted_31 = {
	key: 3,
	class: "text-gray-500 mt-6"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	const _component_router_link = resolveComponent("router-link");
	const _component_TypeIcon = resolveComponent("TypeIcon");
	return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [
		createBaseVNode("div", _hoisted_3, [createBaseVNode("div", null, [createBaseVNode("h1", _hoisted_4, "Add Pokémon to " + toDisplayString($setup.teamName || "Team"), 1), _cache[7] || (_cache[7] = createBaseVNode("p", { class: "text-gray-600" }, "Search and choose the Pokémon you want to add.", -1))]), createVNode(_component_router_link, {
			to: `/equipos/${$setup.teamId}`,
			class: "text-blue-600 hover:underline"
		}, {
			default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode("Back", -1)])]),
			_: 1
		}, 8, ["to"])]),
		createBaseVNode("div", _hoisted_5, [createBaseVNode("div", _hoisted_6, [
			_cache[9] || (_cache[9] = createBaseVNode("label", { class: "block text-sm font-medium text-slate-700 mb-1" }, "Search (partial allowed)", -1)),
			withDirectives(createBaseVNode("input", {
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.searchTerm = $event),
				onInput: _cache[1] || (_cache[1] = (...args) => $setup.onSearchInput && $setup.onSearchInput(...args)),
				placeholder: "Type name or partial (e.g., 'char')",
				class: "input-field w-full"
			}, null, 544), [[vModelText, $setup.searchTerm]]),
			$setup.filteredResults.length && $setup.showResults ? (openBlock(), createElementBlock("ul", _hoisted_7, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.filteredResults.slice(0, 50), (item) => {
				return openBlock(), createElementBlock("li", {
					key: item.name,
					class: "px-3 py-2 cursor-pointer hover:bg-slate-100 flex justify-between",
					onClick: ($event) => $setup.selectSpecies(item)
				}, [createBaseVNode("span", _hoisted_9, toDisplayString(item.name), 1), createBaseVNode("small", _hoisted_10, toDisplayString(item.url ? "" : ""), 1)], 8, _hoisted_8);
			}), 128))])) : createCommentVNode("", true)
		]), createBaseVNode("div", null, [_cache[11] || (_cache[11] = createBaseVNode("label", { class: "block text-sm font-medium text-slate-700 mb-1" }, "Generation", -1)), withDirectives(createBaseVNode("select", {
			"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.selectedGeneration = $event),
			class: "input-field w-full",
			onChange: _cache[3] || (_cache[3] = (...args) => $setup.onGenerationChange && $setup.onGenerationChange(...args))
		}, [_cache[10] || (_cache[10] = createBaseVNode("option", { value: "" }, "All", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList($setup.generations, (g) => {
			return openBlock(), createElementBlock("option", {
				key: g.name,
				value: g.url
			}, toDisplayString(g.name), 9, _hoisted_11);
		}), 128))], 544), [[vModelSelect, $setup.selectedGeneration]])])]),
		$setup.loading ? (openBlock(), createElementBlock("div", _hoisted_12, " Loading... ")) : createCommentVNode("", true),
		$setup.error ? (openBlock(), createElementBlock("div", _hoisted_13, toDisplayString($setup.error), 1)) : createCommentVNode("", true),
		$setup.selectedSpecies ? (openBlock(), createElementBlock("div", _hoisted_14, [
			createBaseVNode("div", _hoisted_15, [createBaseVNode("h2", _hoisted_16, toDisplayString($setup.selectedSpecies.name), 1), _cache[12] || (_cache[12] = createBaseVNode("p", { class: "text-sm text-gray-500" }, "Choose a form if available", -1))]),
			$setup.forms.length > 1 ? (openBlock(), createElementBlock("div", _hoisted_17, [_cache[13] || (_cache[13] = createBaseVNode("label", { class: "text-sm font-medium text-slate-700 mb-1 block" }, "Form / Variant", -1)), withDirectives(createBaseVNode("select", {
				"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.selectedForm = $event),
				class: "input-field w-full"
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.forms, (f) => {
				return openBlock(), createElementBlock("option", {
					key: f.name,
					value: f.name
				}, toDisplayString(f.name), 9, _hoisted_18);
			}), 128))], 512), [[vModelSelect, $setup.selectedForm]])])) : createCommentVNode("", true),
			$setup.pokemonDetail ? (openBlock(), createElementBlock("div", _hoisted_19, [createBaseVNode("div", _hoisted_20, [createBaseVNode("img", {
				src: $setup.pokemonDetail.sprites.front_default,
				alt: "",
				class: "h-36 w-36 object-contain mx-auto mb-4"
			}, null, 8, _hoisted_21), createBaseVNode("div", _hoisted_22, [
				createBaseVNode("div", _hoisted_23, toDisplayString($setup.pokemonDetail.name), 1),
				createBaseVNode("div", _hoisted_24, "#" + toDisplayString($setup.pokemonDetail.id), 1),
				createBaseVNode("div", _hoisted_25, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.pokemonDetail.types, (t) => {
					return openBlock(), createBlock(_component_TypeIcon, {
						key: t,
						type: t
					}, null, 8, ["type"]);
				}), 128))])
			])]), createBaseVNode("div", _hoisted_26, [
				_cache[14] || (_cache[14] = createBaseVNode("h3", { class: "text-lg font-semibold mb-3" }, "Summary", -1)),
				_cache[15] || (_cache[15] = createBaseVNode("p", { class: "text-sm text-gray-600 mb-4" }, "Preview the Pokémon details and assign to the team. You can also pick the desired form above if available.", -1)),
				createBaseVNode("div", _hoisted_27, [createBaseVNode("button", {
					onClick: _cache[5] || (_cache[5] = (...args) => $setup.assignSelected && $setup.assignSelected(...args)),
					class: "btn-primary px-4 py-2",
					disabled: $setup.assigning
				}, toDisplayString($setup.assigning ? "Assigning..." : "Assign to Team"), 9, _hoisted_28), createBaseVNode("button", {
					onClick: _cache[6] || (_cache[6] = (...args) => $setup.clearSelection && $setup.clearSelection(...args)),
					class: "btn-secondary px-4 py-2"
				}, "Cancel")]),
				$setup.assignSuccess ? (openBlock(), createElementBlock("div", _hoisted_29, toDisplayString($setup.assignSuccess), 1)) : createCommentVNode("", true),
				$setup.assignError ? (openBlock(), createElementBlock("div", _hoisted_30, toDisplayString($setup.assignError), 1)) : createCommentVNode("", true)
			])])) : createCommentVNode("", true)
		])) : (openBlock(), createElementBlock("div", _hoisted_31, "No Pokémon selected."))
	])]);
}
var PokemonSlotView_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2eec479b"]]);
//#endregion
export { PokemonSlotView_default as default };
