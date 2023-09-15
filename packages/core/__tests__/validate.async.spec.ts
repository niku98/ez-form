import FieldInstance from "src/Field";
import FormInstance from "src/Form";
import { asyncFieldSchema, asyncSchema } from "src/validation";
import { describe, it } from "vitest";

describe("Async validator", () => {
	it("Login Form", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm>({
			validationSchema: asyncSchema<LoginForm>({
				username: [
					{
						required: true,
						type: "string",
						len: 6,
					},
				],
			}),
		});
		const userName = new FieldInstance<string, LoginForm>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, LoginForm>(form, {
			name: "password",
			validationSchema: asyncFieldSchema({
				type: "string",
				pattern: new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$"),
				required: true,
			}),
		});
		userName.mount();
		password.mount();

		userName.handleChange("johnson");
		password.handleChange("123456");

		form.validate().then(({ valid, errors }) => {
			expect(valid).toBe(false);
			expect(errors.length).toBe(2);
		});
	});

	it("Register Form", ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password_2",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
		};

		const form = new FormInstance<RegisterForm>();
		const userName = new FieldInstance<string, RegisterForm>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm>(form, {
			name: "password",
			validationSchema: asyncFieldSchema({
				type: "string",
				pattern: new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$"),
				required: true,
			}),
		});
		const confirmPassword = new FieldInstance<string, RegisterForm>(form, {
			name: "confirmPassword",
			validationSchema: asyncFieldSchema([
				{
					validator(_, __, ___, source) {
						if (source.password !== source.confirmPassword) {
							return ["Confirm password doesn't match password."];
						}

						return [];
					},
				},
			]),
		});
		const addressLineOne = new FieldInstance<string, RegisterForm>(form, {
			name: "address.lineOne",
		});
		const addressLineTwo = new FieldInstance<string, RegisterForm>(form, {
			name: "address.lineTwo",
		});

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);

		form.validate().then(({ valid, errors }) => {
			expect(valid).toBe(false);
			expect(errors.length).toBe(2);
		});
	});
});
