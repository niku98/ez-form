import FieldInstance from "src/Field";
import FormInstance from "src/Form";
import { zodFieldSchema, zodSchema } from "src/validation";
import { describe, it } from "vitest";
import { z } from "zod";

describe("Yup validator", () => {
	it("Login Form", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm>({
			validationSchema: zodSchema<LoginForm>({
				username: [
					{
						schema: z.string().length(6),
					},
				],
			}),
		});
		const userName = new FieldInstance<string, LoginForm>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, LoginForm>(form, {
			name: "password",
			validationSchema: zodFieldSchema({
				schema: z
					.string()
					.refine((value) =>
						new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$").test(value)
					),
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
			validationSchema: zodFieldSchema({
				schema: z
					.string()
					.refine((value) =>
						new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$").test(value)
					),
			}),
		});
		const confirmPassword = new FieldInstance<string, RegisterForm>(form, {
			name: "confirmPassword",
			validationSchema: zodFieldSchema([
				{
					schema: (values: RegisterForm) =>
						z
							.string()
							.refine(
								() => values.confirmPassword === values.password,
								"Confirm password doesn't match password."
							),
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
