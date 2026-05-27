import { E as toDisplayString, T as ref, a as useRouter, b as renderList, c as withModifiers, d as createBaseVNode, h as createStaticVNode, l as Fragment, m as createElementBlock, p as createCommentVNode, r as teamsAPI, s as vModelText, t as _plugin_vue_export_helper_default, v as onMounted, w as withDirectives, y as openBlock } from "./index-DqJ2-gbd.js";
//#region src/views/TeamsView.vue
var _sfc_main = {
	name: "TeamsView",
	setup() {
		const router = useRouter();
		const teams = ref([]);
		const loading = ref(true);
		const error = ref(null);
		const showCreateModal = ref(false);
		const creating = ref(false);
		const newTeam = ref({
			name: "",
			description: ""
		});
		onMounted(() => {
			loadTeams();
		});
		const loadTeams = async () => {
			loading.value = true;
			error.value = null;
			try {
				const response = await teamsAPI.getAll();
				teams.value = response.data.results ?? response.data;
			} catch (err) {
				error.value = err.response?.data?.error || "Failed to load teams";
			} finally {
				loading.value = false;
			}
		};
		const goToTeam = (teamId) => {
			router.push(`/equipos/${teamId}`);
		};
		const createTeam = async () => {
			creating.value = true;
			try {
				await teamsAPI.create(newTeam.value);
				showCreateModal.value = false;
				newTeam.value = {
					name: "",
					description: ""
				};
				await loadTeams();
			} catch (err) {
				alert("Failed to create team: " + (err.response?.data?.error || "Unknown error"));
			} finally {
				creating.value = false;
			}
		};
		const editTeam = (team) => {
			goToTeam(team.id);
		};
		const deleteTeam = async (team) => {
			if (!confirm(`Are you sure you want to delete "${team.name}"?`)) return;
			try {
				await teamsAPI.delete(team.id);
				await loadTeams();
			} catch (err) {
				alert("Failed to delete team: " + (err.response?.data?.error || "Unknown error"));
			}
		};
		const formatDate = (dateString) => {
			return new Date(dateString).toLocaleDateString();
		};
		return {
			teams,
			loading,
			error,
			showCreateModal,
			creating,
			newTeam,
			loadTeams,
			goToTeam,
			createTeam,
			editTeam,
			deleteTeam,
			formatDate
		};
	}
};
var _hoisted_1 = { class: "max-w-7xl mx-auto px-4 py-8" };
var _hoisted_2 = { class: "flex items-center justify-between mb-8" };
var _hoisted_3 = {
	key: 0,
	class: "text-center py-12"
};
var _hoisted_4 = {
	key: 1,
	class: "text-center py-12"
};
var _hoisted_5 = { class: "text-gray-600 mb-4" };
var _hoisted_6 = {
	key: 2,
	class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
};
var _hoisted_7 = ["onClick"];
var _hoisted_8 = { class: "flex items-center justify-between mb-4" };
var _hoisted_9 = { class: "text-xl font-bold text-gray-900" };
var _hoisted_10 = { class: "text-sm text-gray-500" };
var _hoisted_11 = {
	key: 0,
	class: "text-gray-600 mb-4 line-clamp-2"
};
var _hoisted_12 = {
	key: 1,
	class: "text-gray-400 mb-4 italic"
};
var _hoisted_13 = { class: "flex items-center justify-between text-sm text-gray-500" };
var _hoisted_14 = { class: "flex gap-2" };
var _hoisted_15 = ["onClick"];
var _hoisted_16 = ["onClick"];
var _hoisted_17 = {
	key: 3,
	class: "text-center py-12"
};
var _hoisted_18 = {
	key: 4,
	class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
};
var _hoisted_19 = { class: "bg-white rounded-lg p-6 w-full max-w-md" };
var _hoisted_20 = { class: "mb-4" };
var _hoisted_21 = { class: "mb-6" };
var _hoisted_22 = { class: "flex gap-3" };
var _hoisted_23 = ["disabled"];
var _hoisted_24 = { key: 0 };
var _hoisted_25 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createElementBlock("div", _hoisted_1, [
		createBaseVNode("div", _hoisted_2, [_cache[7] || (_cache[7] = createBaseVNode("div", null, [createBaseVNode("h1", { class: "text-3xl font-bold text-gray-900" }, "My Teams"), createBaseVNode("p", { class: "text-gray-600 mt-1" }, "Manage your Pokémon teams and strategies")], -1)), createBaseVNode("button", {
			onClick: _cache[0] || (_cache[0] = ($event) => $setup.showCreateModal = true),
			class: "btn-primary px-6 py-3 text-lg"
		}, " Create New Team ")]),
		$setup.loading ? (openBlock(), createElementBlock("div", _hoisted_3, [..._cache[8] || (_cache[8] = [createBaseVNode("div", { class: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }, null, -1), createBaseVNode("p", { class: "text-gray-600 mt-4" }, "Loading your teams...", -1)])])) : $setup.error ? (openBlock(), createElementBlock("div", _hoisted_4, [
			_cache[9] || (_cache[9] = createBaseVNode("div", { class: "text-red-600 mb-4" }, [createBaseVNode("svg", {
				class: "w-12 h-12 mx-auto",
				fill: "none",
				stroke: "currentColor",
				viewBox: "0 0 24 24"
			}, [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"stroke-width": "2",
				d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
			})])], -1)),
			_cache[10] || (_cache[10] = createBaseVNode("p", { class: "text-red-600 font-semibold mb-2" }, "Error loading teams", -1)),
			createBaseVNode("p", _hoisted_5, toDisplayString($setup.error), 1),
			createBaseVNode("button", {
				onClick: _cache[1] || (_cache[1] = (...args) => $setup.loadTeams && $setup.loadTeams(...args)),
				class: "btn-secondary"
			}, "Try Again")
		])) : $setup.teams.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_6, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.teams, (team) => {
			return openBlock(), createElementBlock("div", {
				key: team.id,
				class: "pokemon-card cursor-pointer hover:shadow-lg transition-shadow",
				onClick: ($event) => $setup.goToTeam(team.id)
			}, [
				createBaseVNode("div", _hoisted_8, [createBaseVNode("h3", _hoisted_9, toDisplayString(team.name), 1), createBaseVNode("span", _hoisted_10, toDisplayString(team.pokemon_count) + "/6 Pokémon", 1)]),
				team.description ? (openBlock(), createElementBlock("p", _hoisted_11, toDisplayString(team.description), 1)) : (openBlock(), createElementBlock("p", _hoisted_12, "No description")),
				createBaseVNode("div", _hoisted_13, [createBaseVNode("span", null, "Created " + toDisplayString($setup.formatDate(team.created_at)), 1), createBaseVNode("div", _hoisted_14, [createBaseVNode("button", {
					onClick: withModifiers(($event) => $setup.editTeam(team), ["stop"]),
					class: "text-blue-600 hover:text-blue-800"
				}, " Edit ", 8, _hoisted_15), createBaseVNode("button", {
					onClick: withModifiers(($event) => $setup.deleteTeam(team), ["stop"]),
					class: "text-red-600 hover:text-red-800"
				}, " Delete ", 8, _hoisted_16)])])
			], 8, _hoisted_7);
		}), 128))])) : (openBlock(), createElementBlock("div", _hoisted_17, [_cache[11] || (_cache[11] = createStaticVNode("<div class=\"text-gray-400 mb-4\" data-v-aba12abe><svg class=\"w-16 h-16 mx-auto\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" data-v-aba12abe><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10\" data-v-aba12abe></path></svg></div><h3 class=\"text-xl font-semibold text-gray-900 mb-2\" data-v-aba12abe>No teams yet</h3><p class=\"text-gray-600 mb-6\" data-v-aba12abe>Create your first Pokémon team to get started!</p>", 3)), createBaseVNode("button", {
			onClick: _cache[2] || (_cache[2] = ($event) => $setup.showCreateModal = true),
			class: "btn-primary px-8 py-3 text-lg"
		}, " Create Your First Team ")])),
		$setup.showCreateModal ? (openBlock(), createElementBlock("div", _hoisted_18, [createBaseVNode("div", _hoisted_19, [_cache[14] || (_cache[14] = createBaseVNode("h3", { class: "text-xl font-bold mb-4" }, "Create New Team", -1)), createBaseVNode("form", { onSubmit: _cache[6] || (_cache[6] = withModifiers((...args) => $setup.createTeam && $setup.createTeam(...args), ["prevent"])) }, [
			createBaseVNode("div", _hoisted_20, [_cache[12] || (_cache[12] = createBaseVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Team Name", -1)), withDirectives(createBaseVNode("input", {
				"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.newTeam.name = $event),
				type: "text",
				required: "",
				class: "input-field",
				placeholder: "Enter team name"
			}, null, 512), [[vModelText, $setup.newTeam.name]])]),
			createBaseVNode("div", _hoisted_21, [_cache[13] || (_cache[13] = createBaseVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Description (Optional)", -1)), withDirectives(createBaseVNode("textarea", {
				"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.newTeam.description = $event),
				class: "input-field",
				rows: "3",
				placeholder: "Describe your team strategy..."
			}, null, 512), [[vModelText, $setup.newTeam.description]])]),
			createBaseVNode("div", _hoisted_22, [createBaseVNode("button", {
				type: "submit",
				class: "btn-primary flex-1",
				disabled: $setup.creating
			}, [!$setup.creating ? (openBlock(), createElementBlock("span", _hoisted_24, "Create Team")) : (openBlock(), createElementBlock("span", _hoisted_25, "Creating..."))], 8, _hoisted_23), createBaseVNode("button", {
				onClick: _cache[5] || (_cache[5] = ($event) => $setup.showCreateModal = false),
				class: "btn-secondary flex-1"
			}, " Cancel ")])
		], 32)])])) : createCommentVNode("", true)
	]);
}
var TeamsView_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-aba12abe"]]);
//#endregion
export { TeamsView_default as default };
