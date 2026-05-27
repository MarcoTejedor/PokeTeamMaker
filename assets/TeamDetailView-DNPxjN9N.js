import { E as toDisplayString, T as ref, _ as createVNode, a as useRouter, b as renderList, c as withModifiers, d as createBaseVNode, f as createBlock, i as useRoute, l as Fragment, m as createElementBlock, p as createCommentVNode, r as teamsAPI, s as vModelText, t as _plugin_vue_export_helper_default, u as computed, v as onMounted, w as withDirectives, x as resolveComponent, y as openBlock } from "./index-DkkCPkP6.js";
import { t as TypeIcon_default } from "./TypeIcon-BGU07Z9H.js";
//#region src/views/TeamDetailView.vue
var TYPE_EFFECTIVENESS = {
	normal: {
		weak_to: ["fighting"],
		resists: [],
		immune_to: ["ghost"]
	},
	fire: {
		weak_to: [
			"water",
			"ground",
			"rock"
		],
		resists: [
			"fire",
			"grass",
			"ice",
			"bug",
			"steel",
			"fairy"
		],
		immune_to: []
	},
	water: {
		weak_to: ["electric", "grass"],
		resists: [
			"fire",
			"water",
			"ice",
			"steel"
		],
		immune_to: []
	},
	electric: {
		weak_to: ["ground"],
		resists: [
			"flying",
			"steel",
			"electric"
		],
		immune_to: []
	},
	grass: {
		weak_to: [
			"fire",
			"ice",
			"poison",
			"flying",
			"bug"
		],
		resists: [
			"ground",
			"water",
			"grass",
			"electric"
		],
		immune_to: []
	},
	ice: {
		weak_to: [
			"fire",
			"fighting",
			"rock",
			"steel"
		],
		resists: ["ice"],
		immune_to: []
	},
	fighting: {
		weak_to: [
			"flying",
			"psychic",
			"fairy"
		],
		resists: [
			"rock",
			"bug",
			"dark"
		],
		immune_to: []
	},
	poison: {
		weak_to: ["ground", "psychic"],
		resists: [
			"fighting",
			"poison",
			"bug",
			"grass"
		],
		immune_to: []
	},
	ground: {
		weak_to: [
			"water",
			"grass",
			"ice"
		],
		resists: ["poison", "rock"],
		immune_to: ["electric"]
	},
	flying: {
		weak_to: [
			"electric",
			"ice",
			"rock"
		],
		resists: [
			"fighting",
			"bug",
			"grass"
		],
		immune_to: []
	},
	psychic: {
		weak_to: [
			"bug",
			"ghost",
			"dark"
		],
		resists: ["fighting", "psychic"],
		immune_to: []
	},
	bug: {
		weak_to: [
			"fire",
			"flying",
			"rock"
		],
		resists: [
			"fighting",
			"ground",
			"grass"
		],
		immune_to: []
	},
	rock: {
		weak_to: [
			"water",
			"grass",
			"fighting",
			"ground",
			"steel"
		],
		resists: [
			"normal",
			"flying",
			"poison",
			"fire"
		],
		immune_to: []
	},
	ghost: {
		weak_to: ["ghost", "dark"],
		resists: ["poison", "bug"],
		immune_to: ["normal", "fighting"]
	},
	dragon: {
		weak_to: [
			"ice",
			"dragon",
			"fairy"
		],
		resists: [
			"fire",
			"water",
			"grass",
			"electric"
		],
		immune_to: []
	},
	dark: {
		weak_to: [
			"fighting",
			"bug",
			"fairy"
		],
		resists: ["ghost", "dark"],
		immune_to: ["psychic"]
	},
	steel: {
		weak_to: [
			"fire",
			"water",
			"ground"
		],
		resists: [
			"normal",
			"flying",
			"rock",
			"bug",
			"steel",
			"grass",
			"psychic",
			"ice",
			"dragon",
			"fairy"
		],
		immune_to: ["poison"]
	},
	fairy: {
		weak_to: ["poison", "steel"],
		resists: [
			"fighting",
			"bug",
			"dark"
		],
		immune_to: []
	}
};
var _sfc_main = {
	name: "TeamDetailView",
	components: { TypeIcon: TypeIcon_default },
	setup() {
		const route = useRoute();
		const router = useRouter();
		const team = ref({ pokemon_in_team: [] });
		const loading = ref(false);
		const error = ref(null);
		const showEditModal = ref(false);
		const editForm = ref({
			name: "",
			description: ""
		});
		const analysisData = ref({
			weaknesses: {},
			totalPokemon: 0
		});
		const loadTeam = async () => {
			loading.value = true;
			error.value = null;
			try {
				team.value = (await teamsAPI.getDetail(route.params.id)).data;
				editForm.value = {
					name: team.value.name || "",
					description: team.value.description || ""
				};
				computeAnalysis();
			} catch (err) {
				error.value = err.response?.data?.error || "Failed to load team.";
			} finally {
				loading.value = false;
			}
		};
		const sortedRoster = computed(() => {
			return [...team.value.pokemon_in_team || []].sort((a, b) => a.position - b.position);
		});
		function computeAnalysis() {
			const weaknesses = {};
			const resistances = {};
			const immunities = {};
			const roster = team.value.pokemon_in_team || [];
			roster.forEach((poke) => {
				(poke.types || []).forEach((t) => {
					const typeInfo = TYPE_EFFECTIVENESS[t];
					if (!typeInfo) return;
					typeInfo.weak_to.forEach((w) => {
						weaknesses[w] = (weaknesses[w] || 0) + 1;
					});
					typeInfo.resists.forEach((r) => {
						resistances[r] = (resistances[r] || 0) + 1;
					});
					typeInfo.immune_to.forEach((i) => {
						immunities[i] = (immunities[i] || 0) + 1;
					});
				});
			});
			analysisData.value = {
				weaknesses,
				resistances,
				immunities,
				totalPokemon: roster.length
			};
		}
		async function saveTeam() {
			try {
				await teamsAPI.update(route.params.id, {
					name: editForm.value.name,
					description: editForm.value.description
				});
				showEditModal.value = false;
				await loadTeam();
			} catch (err) {
				alert("Failed to save team.");
			}
		}
		function confirmDeleteTeam() {
			if (!confirm("Delete this team permanently?")) return;
			teamsAPI.delete(route.params.id).then(() => router.push("/equipos")).catch(() => alert("Failed to delete team."));
		}
		function confirmDeletePokemon(pokemon) {
			if (!confirm(`Remove ${pokemon.name} from this team?`)) return;
			teamsAPI.clearSlot(route.params.id, pokemon.position).then(() => loadTeam()).catch(() => alert("Failed to delete Pokémon from team."));
		}
		function goToEdit(pokemon) {
			router.push(`/equipos/${route.params.id}/slot/${pokemon.position}`);
		}
		function handleAddPokemon() {
			const occupied = new Set((team.value.pokemon_in_team || []).map((p) => p.position));
			for (let pos = 1; pos <= 6; pos++) if (!occupied.has(pos)) {
				router.push(`/equipos/${route.params.id}/slot/${pos}`);
				return;
			}
		}
		onMounted(loadTeam);
		return {
			team,
			loading,
			error,
			showEditModal,
			editForm,
			saveTeam,
			sortedRoster,
			handleAddPokemon,
			goToEdit,
			confirmDeletePokemon,
			confirmDeleteTeam,
			analysisData
		};
	}
};
var _hoisted_1 = { class: "max-w-6xl mx-auto px-4 py-8" };
var _hoisted_2 = { class: "flex items-start justify-between mb-6" };
var _hoisted_3 = { class: "text-3xl font-bold text-slate-900" };
var _hoisted_4 = { class: "text-gray-600 mt-1" };
var _hoisted_5 = { class: "flex items-center gap-3" };
var _hoisted_6 = { class: "rounded-2xl bg-white p-6 shadow-sm mb-6" };
var _hoisted_7 = {
	key: 0,
	class: "text-center py-8 text-gray-600"
};
var _hoisted_8 = {
	key: 1,
	class: "grid grid-cols-3 gap-4"
};
var _hoisted_9 = ["src", "alt"];
var _hoisted_10 = { class: "text-center flex-1" };
var _hoisted_11 = { class: "text-sm font-bold text-slate-900" };
var _hoisted_12 = { class: "text-xs text-gray-500" };
var _hoisted_13 = { class: "mt-2 flex items-center gap-1 justify-center flex-wrap" };
var _hoisted_14 = {
	key: 0,
	class: "mt-1 inline-block px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded"
};
var _hoisted_15 = { class: "flex gap-2 w-full" };
var _hoisted_16 = ["onClick"];
var _hoisted_17 = ["onClick"];
var _hoisted_18 = { class: "rounded-2xl bg-white p-6 shadow-sm" };
var _hoisted_19 = {
	key: 0,
	class: "text-center py-8 text-gray-600"
};
var _hoisted_20 = {
	key: 1,
	class: "grid grid-cols-3 gap-6"
};
var _hoisted_21 = { class: "analysis-column" };
var _hoisted_22 = {
	key: 0,
	class: "text-xs text-gray-500"
};
var _hoisted_23 = {
	key: 1,
	class: "flex flex-wrap gap-2"
};
var _hoisted_24 = { class: "absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" };
var _hoisted_25 = { class: "analysis-column" };
var _hoisted_26 = {
	key: 0,
	class: "text-xs text-gray-500"
};
var _hoisted_27 = {
	key: 1,
	class: "flex flex-wrap gap-2"
};
var _hoisted_28 = { class: "absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" };
var _hoisted_29 = { class: "analysis-column" };
var _hoisted_30 = {
	key: 0,
	class: "text-xs text-gray-500"
};
var _hoisted_31 = {
	key: 1,
	class: "flex flex-wrap gap-2"
};
var _hoisted_32 = { class: "absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" };
var _hoisted_33 = {
	key: 0,
	class: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
};
var _hoisted_34 = { class: "w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl" };
var _hoisted_35 = { class: "flex justify-end gap-3 pt-4" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	const _component_TypeIcon = resolveComponent("TypeIcon");
	return openBlock(), createElementBlock("div", _hoisted_1, [
		createBaseVNode("div", _hoisted_2, [createBaseVNode("div", null, [createBaseVNode("h1", _hoisted_3, toDisplayString($setup.team.name || "Team"), 1), createBaseVNode("p", _hoisted_4, toDisplayString($setup.team.pokemon_in_team.length) + " Pokémon", 1)]), createBaseVNode("div", _hoisted_5, [
			$setup.team.pokemon_in_team.length < 6 ? (openBlock(), createElementBlock("button", {
				key: 0,
				onClick: _cache[0] || (_cache[0] = (...args) => $setup.handleAddPokemon && $setup.handleAddPokemon(...args)),
				class: "btn-primary px-4 py-2"
			}, " Add Pokémon ")) : createCommentVNode("", true),
			createBaseVNode("button", {
				onClick: _cache[1] || (_cache[1] = ($event) => $setup.showEditModal = true),
				class: "btn-secondary px-4 py-2"
			}, " Edit Team "),
			createBaseVNode("button", {
				onClick: _cache[2] || (_cache[2] = (...args) => $setup.confirmDeleteTeam && $setup.confirmDeleteTeam(...args)),
				class: "btn-danger px-4 py-2"
			}, " Delete Team ")
		])]),
		createBaseVNode("section", _hoisted_6, [_cache[7] || (_cache[7] = createBaseVNode("h2", { class: "text-xl font-semibold mb-4" }, "Roster", -1)), $setup.team.pokemon_in_team.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_7, " No Pokémon in this team yet. ")) : (openBlock(), createElementBlock("div", _hoisted_8, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.sortedRoster, (pokemon) => {
			return openBlock(), createElementBlock("div", {
				key: pokemon.position,
				class: "pokemon-card p-4 flex flex-col items-center gap-2"
			}, [
				createBaseVNode("img", {
					src: pokemon.sprites.front_default,
					alt: pokemon.name,
					class: "h-16 w-16 object-contain"
				}, null, 8, _hoisted_9),
				createBaseVNode("div", _hoisted_10, [
					createBaseVNode("div", _hoisted_11, toDisplayString(pokemon.name), 1),
					createBaseVNode("div", _hoisted_12, "#" + toDisplayString(pokemon.pokedex_id), 1),
					createBaseVNode("div", _hoisted_13, [(openBlock(true), createElementBlock(Fragment, null, renderList(pokemon.types, (t) => {
						return openBlock(), createBlock(_component_TypeIcon, {
							key: t,
							type: t
						}, null, 8, ["type"]);
					}), 128))]),
					pokemon.equipped_item ? (openBlock(), createElementBlock("span", _hoisted_14, toDisplayString(pokemon.equipped_item), 1)) : createCommentVNode("", true)
				]),
				createBaseVNode("div", _hoisted_15, [createBaseVNode("button", {
					onClick: ($event) => $setup.goToEdit(pokemon),
					class: "flex-1 text-xs text-blue-600 hover:underline"
				}, "Edit", 8, _hoisted_16), createBaseVNode("button", {
					onClick: ($event) => $setup.confirmDeletePokemon(pokemon),
					class: "flex-1 text-xs text-red-600 hover:underline"
				}, "Delete", 8, _hoisted_17)])
			]);
		}), 128))]))]),
		createBaseVNode("section", _hoisted_18, [_cache[11] || (_cache[11] = createBaseVNode("h3", { class: "text-xl font-semibold mb-4" }, "Type Analysis", -1)), $setup.analysisData.totalPokemon === 0 ? (openBlock(), createElementBlock("div", _hoisted_19, " Add Pokémon to see analysis. ")) : (openBlock(), createElementBlock("div", _hoisted_20, [
			createBaseVNode("div", _hoisted_21, [_cache[8] || (_cache[8] = createBaseVNode("h4", { class: "text-sm font-semibold text-slate-700 mb-3" }, "Weaknesses", -1)), Object.keys($setup.analysisData.weaknesses).length === 0 ? (openBlock(), createElementBlock("div", _hoisted_22, "None")) : (openBlock(), createElementBlock("div", _hoisted_23, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.analysisData.weaknesses, (count, type) => {
				return openBlock(), createElementBlock("div", {
					key: `weak-${type}`,
					class: "relative"
				}, [createVNode(_component_TypeIcon, { type }, null, 8, ["type"]), createBaseVNode("span", _hoisted_24, toDisplayString(count), 1)]);
			}), 128))]))]),
			createBaseVNode("div", _hoisted_25, [_cache[9] || (_cache[9] = createBaseVNode("h4", { class: "text-sm font-semibold text-slate-700 mb-3" }, "Resistances", -1)), Object.keys($setup.analysisData.resistances).length === 0 ? (openBlock(), createElementBlock("div", _hoisted_26, "None")) : (openBlock(), createElementBlock("div", _hoisted_27, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.analysisData.resistances, (count, type) => {
				return openBlock(), createElementBlock("div", {
					key: `resist-${type}`,
					class: "relative"
				}, [createVNode(_component_TypeIcon, { type }, null, 8, ["type"]), createBaseVNode("span", _hoisted_28, toDisplayString(count), 1)]);
			}), 128))]))]),
			createBaseVNode("div", _hoisted_29, [_cache[10] || (_cache[10] = createBaseVNode("h4", { class: "text-sm font-semibold text-slate-700 mb-3" }, "Immunities", -1)), Object.keys($setup.analysisData.immunities).length === 0 ? (openBlock(), createElementBlock("div", _hoisted_30, "None")) : (openBlock(), createElementBlock("div", _hoisted_31, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.analysisData.immunities, (count, type) => {
				return openBlock(), createElementBlock("div", {
					key: `immune-${type}`,
					class: "relative"
				}, [createVNode(_component_TypeIcon, { type }, null, 8, ["type"]), createBaseVNode("span", _hoisted_32, toDisplayString(count), 1)]);
			}), 128))]))])
		]))]),
		$setup.showEditModal ? (openBlock(), createElementBlock("div", _hoisted_33, [createBaseVNode("div", _hoisted_34, [_cache[15] || (_cache[15] = createBaseVNode("h3", { class: "text-2xl font-bold mb-4" }, "Edit Team", -1)), createBaseVNode("form", {
			onSubmit: _cache[6] || (_cache[6] = withModifiers((...args) => $setup.saveTeam && $setup.saveTeam(...args), ["prevent"])),
			class: "space-y-4"
		}, [
			createBaseVNode("div", null, [_cache[12] || (_cache[12] = createBaseVNode("label", { class: "block text-sm font-medium text-slate-700 mb-1" }, "Team Name", -1)), withDirectives(createBaseVNode("input", {
				"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.editForm.name = $event),
				type: "text",
				class: "input-field w-full",
				required: ""
			}, null, 512), [[vModelText, $setup.editForm.name]])]),
			createBaseVNode("div", null, [_cache[13] || (_cache[13] = createBaseVNode("label", { class: "block text-sm font-medium text-slate-700 mb-1" }, "Description", -1)), withDirectives(createBaseVNode("textarea", {
				"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.editForm.description = $event),
				class: "input-field w-full",
				rows: "4"
			}, null, 512), [[vModelText, $setup.editForm.description]])]),
			createBaseVNode("div", _hoisted_35, [createBaseVNode("button", {
				type: "button",
				onClick: _cache[5] || (_cache[5] = ($event) => $setup.showEditModal = false),
				class: "btn-secondary"
			}, "Cancel"), _cache[14] || (_cache[14] = createBaseVNode("button", {
				type: "submit",
				class: "btn-primary"
			}, "Save Changes", -1))])
		], 32)])])) : createCommentVNode("", true)
	]);
}
var TeamDetailView_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-29cef03d"]]);
//#endregion
export { TeamDetailView_default as default };
