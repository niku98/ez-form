import FieldInstance from "src/Field";
import FieldArrayInstance from "src/FieldArray";
import FormInstance from "src/Form";
import { clone } from "src/utilities";
import { describe, it } from "vitest";

describe("Form values", () => {
	it("Login form", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm>();
		const userName = new FieldInstance<string, LoginForm>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, LoginForm>(form, {
			name: "password",
		});

		userName.mount();
		password.mount();

		userName.handleChange("johnson");
		password.handleChange("secret_password");

		expect(form.getValues()).toMatchObject({
			username: "johnson",
			password: "secret_password",
		});
	});

	it("Register form", ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
			cardNumbers: string[];
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
			cardNumbers: ["123"],
		};

		const form = new FormInstance<RegisterForm>();
		const userName = new FieldInstance<string, RegisterForm>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm>(form, {
			name: "password",
		});
		const confirmPassword = new FieldInstance<string, RegisterForm>(form, {
			name: "confirmPassword",
		});
		const addressLineOne = new FieldInstance<string, RegisterForm>(form, {
			name: "address.lineOne",
		});
		const addressLineTwo = new FieldInstance<string, RegisterForm>(form, {
			name: "address.lineTwo",
		});
		const cardNumbers = new FieldArrayInstance<string[], RegisterForm>(form, {
			name: "cardNumbers",
		});

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();
		cardNumbers.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);
		cardNumbers.push(formData.cardNumbers[0]!);

		expect(form.getValues()).toMatchObject(formData);
	});
});

describe("Form values - Field Array", () => {
	interface User {
		username: string;
		password: string;
	}

	interface UsersForm {
		users: User[];
	}

	const formData: UsersForm = {
		users: Array(10)
			.fill(0)
			.map((_, index) => {
				return {
					username: "user_" + (index + 1),
					password: "secret_password",
				};
			}),
	};

	const form = new FormInstance<UsersForm>({
		initialValues: clone(formData),
	});
	const usersField = new FieldArrayInstance<User[], UsersForm>(form, {
		name: "users",
	});

	form.mount();
	usersField.mount();

	it("Push", ({ expect }) => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};
		usersField.push(user);

		expect(form.getValues()).toMatchObject({
			users: [...formData.users, user],
		});
	});

	it("Pop", ({ expect }) => {
		form.reset();
		usersField.pop();

		const users = formData.users.slice(0);
		users.pop();

		expect(form.getValues()).toMatchObject({
			users: users,
		});
	});

	it("Insert", ({ expect }) => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};
		form.reset();
		usersField.insert(5, user);

		const users = formData.users.slice(0);
		users.splice(5, 0, user);

		expect(form.getValues()).toMatchObject({
			users: users,
		});
	});

	it("Shift", ({ expect }) => {
		form.reset();
		usersField.shift();

		const users = formData.users.slice(0);
		users.shift();

		expect(form.getValues()).toMatchObject({
			users: users,
		});
	});

	it("Unshift", ({ expect }) => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};
		form.reset();
		usersField.unshift(user);

		expect(form.getValues()).toMatchObject({
			users: [user, ...formData.users],
		});
	});

	it("Replace", ({ expect }) => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};
		form.reset();
		usersField.replace(2, user);

		const users = formData.users.slice(0);
		users.splice(2, 1, user);

		expect(form.getValues()).toMatchObject({
			users: users,
		});
	});

	it("Remove", ({ expect }) => {
		form.reset();
		usersField.remove(2);

		const users = formData.users.slice(0);
		users.splice(2, 1);

		expect(form.getValues()).toMatchObject({
			users: users,
		});
	});

	it("Move", ({ expect }) => {
		form.reset();
		usersField.move(2, 5);

		const users = formData.users.slice(0);
		const temp = users[2] as User;
		users.splice(2, 1);
		users.splice(5, 0, temp);

		expect(form.getValues()).toMatchObject({
			users: users,
		});
	});

	it("Swap", ({ expect }) => {
		form.reset();
		usersField.swap(2, 5);

		const users = formData.users.slice(0);
		const temp = users[2] as User;
		users[2] = users[5] as User;
		users[5] = temp;

		expect(form.getValues()).toMatchObject({
			users: users,
		});
	});
});
