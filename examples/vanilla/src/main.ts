import { createForm } from "@niku/ez-form-vanilla";

$(document).ready(function () {
	const form = createForm({
		el: "#test-form",
		initialValues: {
			email: "",
			password: "",
			referer: "",
			remember: false,
			users: [{ username: "abc", age: 1 }],
		},
	});
	form.createField({
		name: "email",
	});
	form.createField({
		name: "password",
	});
	form.createField({
		name: "referer",
		handleInput(field) {
			const select = $("js-example-basic-multiple");
			select.select2();
			select.val(field.getValue());

			select.on("select2:select", () => {
				field.handleChange(select.val());
			});
			select.on("select2:unselect", () => {
				field.handleChange(select.val());
			});

			field.on("change", () => {
				select.val(field.getValue());
			});
		},
	});

	form.createField({
		name: "remember",
		valuePropName: "checked",
	});

	const usersField = form.createFieldArray({
		name: "users",
		el: "#users",
		// initialValue: [{ username: "", age: 0 }],
		itemTemplate(index) {
			const containerEl = document.createElement("div");
			containerEl.id = `user-item-${index}`;
			containerEl.classList.add("user-item");

			containerEl.innerHTML = `<h4>User ${index + 1}</h4>
					<div class="mb-3">
						<label for="user-${index}-username" class="form-label">Username</label>
						<input
							name="users.${index}.username"
							class="form-control"
							id="user-${index}-username"
						/>
					</div>
					<div class="mb-3">
						<label for="user-${index}-age" class="form-label">Age</label>
						<input
							name="users.${index}.age"
							class="form-control"
							type="number"
							id="user-${index}-age"
						/>
					</div>`;

			return containerEl;
		},
		itemFieldsCreator(index, field) {
			return [
				field.createField({
					name: `username`,
					index,
				}),
				field.createField({
					name: `age`,
					index,
				}),
			];
		},
		itemsSelector: ".user-item",
	});

	form.el.querySelector("#add-user-btn")?.addEventListener("click", () => {
		usersField.push({
			username: "",
			age: 0,
		});
	});

	form.el.querySelector("#user-action-btn")?.addEventListener("click", () => {
		usersField.remove(0);
	});

	form.on("submit", () => {
		console.log(form.values);
	});
});
