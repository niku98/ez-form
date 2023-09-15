import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Fragment } from "react";
import { BindingFieldInput, useForm } from "src/index";
import { describe, it } from "vitest";

describe("Form values", () => {
	it("Login form", async () => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const loginFormData: LoginForm = {
			username: "johnson",
			password: "secret_password",
		};

		function LoginPage() {
			const form = useForm<LoginForm>();

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							<BindingFieldInput>
								<input data-testid="usernameInput" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="password">
							<BindingFieldInput>
								<input data-testid="passwordInput" type="password" />
							</BindingFieldInput>
						</form.Field>
					</form>
				</form.Form>
			);
		}

		render(<LoginPage />);
		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();

		await userEvent.type(usernameInput, loginFormData.username);
		await userEvent.type(passwordInput, loginFormData.password);

		expect(usernameInput).toHaveValue(loginFormData.username);
		expect(passwordInput).toHaveValue(loginFormData.password);
	});

	it("Login form with default values", async () => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const loginFormData: LoginForm = {
			username: "johnson",
			password: "secret_password",
		};

		function LoginPage() {
			const form = useForm<LoginForm>({
				initialValues: loginFormData,
			});

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							<BindingFieldInput>
								<input data-testid="usernameInput" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="password">
							<BindingFieldInput>
								<input data-testid="passwordInput" type="password" />
							</BindingFieldInput>
						</form.Field>
					</form>
				</form.Form>
			);
		}

		render(<LoginPage />);
		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(usernameInput).toHaveValue(loginFormData.username);
		expect(passwordInput).toHaveValue(loginFormData.password);

		await userEvent.type(usernameInput, "_2");
		await userEvent.type(passwordInput, "_2");

		expect(usernameInput).toHaveValue(loginFormData.username + "_2");
		expect(passwordInput).toHaveValue(loginFormData.password + "_2");
	});

	// ---------------------------------------------------------------------------

	it("Register form", async () => {
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
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
		};

		function RegisterPage() {
			const form = useForm<RegisterForm>({});

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							<BindingFieldInput>
								<input data-testid="usernameInput" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="password">
							<BindingFieldInput>
								<input data-testid="passwordInput" type="password" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="confirmPassword">
							<BindingFieldInput>
								<input data-testid="confirmPasswordInput" type="password" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="address.lineOne">
							<BindingFieldInput>
								<input data-testid="addressLineOneInput" type="password" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="address.lineTwo">
							<BindingFieldInput>
								<input data-testid="addressLineTwoInput" type="password" />
							</BindingFieldInput>
						</form.Field>
					</form>
				</form.Form>
			);
		}

		render(<RegisterPage />);
		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");
		const confirmPasswordInput = screen.getByTestId("confirmPasswordInput");
		const addressLineOneInput = screen.getByTestId("addressLineOneInput");
		const addressLineTwoInput = screen.getByTestId("addressLineTwoInput");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(confirmPasswordInput).toBeInTheDocument();
		expect(addressLineOneInput).toBeInTheDocument();
		expect(addressLineTwoInput).toBeInTheDocument();

		await userEvent.type(usernameInput, formData.username);
		await userEvent.type(passwordInput, formData.password);
		await userEvent.type(confirmPasswordInput, formData.confirmPassword);
		await userEvent.type(addressLineOneInput, formData.address.lineOne);
		await userEvent.type(addressLineTwoInput, formData.address.lineTwo);

		expect(usernameInput).toHaveValue(formData.username);
		expect(passwordInput).toHaveValue(formData.password);
		expect(confirmPasswordInput).toHaveValue(formData.confirmPassword);
		expect(addressLineOneInput).toHaveValue(formData.address.lineOne);
		expect(addressLineTwoInput).toHaveValue(formData.address.lineTwo);
	});

	it("Register form with default values", async () => {
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
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
		};

		function RegisterPage() {
			const form = useForm<RegisterForm>({
				initialValues: formData,
			});

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							<BindingFieldInput>
								<input data-testid="usernameInput" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="password">
							<BindingFieldInput>
								<input data-testid="passwordInput" type="password" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="confirmPassword">
							<BindingFieldInput>
								<input data-testid="confirmPasswordInput" type="password" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="address.lineOne">
							<BindingFieldInput>
								<input data-testid="addressLineOneInput" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="address.lineTwo">
							<BindingFieldInput>
								<input data-testid="addressLineTwoInput" />
							</BindingFieldInput>
						</form.Field>
						<form.ObserveField name="username">
							{({ value }) => (
								<span data-testid="observeUsername">{value}</span>
							)}
						</form.ObserveField>
					</form>
				</form.Form>
			);
		}

		render(<RegisterPage />);
		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");
		const confirmPasswordInput = screen.getByTestId("confirmPasswordInput");
		const addressLineOneInput = screen.getByTestId("addressLineOneInput");
		const addressLineTwoInput = screen.getByTestId("addressLineTwoInput");
		const observeUsernameEl = screen.getByTestId("observeUsername");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(confirmPasswordInput).toBeInTheDocument();
		expect(addressLineOneInput).toBeInTheDocument();
		expect(addressLineTwoInput).toBeInTheDocument();
		expect(observeUsernameEl).toBeInTheDocument();

		expect(usernameInput).toHaveValue(formData.username);
		expect(passwordInput).toHaveValue(formData.password);
		expect(confirmPasswordInput).toHaveValue(formData.confirmPassword);
		expect(addressLineOneInput).toHaveValue(formData.address.lineOne);
		expect(addressLineTwoInput).toHaveValue(formData.address.lineTwo);

		await userEvent.type(usernameInput, "_2");
		await userEvent.type(passwordInput, "_2");

		expect(usernameInput).toHaveValue(formData.username + "_2");
		expect(passwordInput).toHaveValue(formData.password + "_2");
		expect(observeUsernameEl).toHaveTextContent(formData.username + "_2");
	});
});

describe("Field Array", () => {
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
					username: `user_${index + 1}`,
					password: "secret_password",
				};
			}),
	};

	it("Push", async ({ expect }) => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};

		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo.map((field) => {
									return (
										<Fragment key={field.key}>
											<fieldArray.Field index={field.index} name="username">
												<BindingFieldInput>
													<input
														data-testid={`users.username.${field.index}`}
													/>
												</BindingFieldInput>
											</fieldArray.Field>
											<fieldArray.Field index={field.index} name="password">
												<BindingFieldInput>
													<input
														data-testid={`users.password.${field.index}`}
													/>
												</BindingFieldInput>
											</fieldArray.Field>
										</Fragment>
									);
								})}

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.push(user)}
								>
									Add user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(<ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);

		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);

		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);

		await userEvent.click(actionButton);

		expect(screen.getByTestId("users.username.10")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.10")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.10")).toHaveValue(user.username);
		expect(screen.getByTestId("users.password.10")).toHaveValue(user.password);
	});

	it("Pop", async ({ expect }) => {
		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo.map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												<BindingFieldInput>
													<input data-testid={`users.username.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												<BindingFieldInput>
													<input data-testid={`users.password.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
										</>
									);
								})}

								<span data-testid="users_length">{fieldsInfo.length}</span>

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.pop()}
								>
									Pop user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(<ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");
		const usersLength = screen.getByTestId("users_length");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);
		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();
		expect(usersLength).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);
		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);
		expect(usersLength).toHaveTextContent("10");

		await userEvent.click(actionButton);

		expect(usersLength).toHaveTextContent("9");
	});

	it("Insert", async ({ expect }) => {
		const newUser: User = {
			username: "User to insert",
			password: "Password",
		};

		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo.map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												<BindingFieldInput>
													<input data-testid={`users.username.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												<BindingFieldInput>
													<input data-testid={`users.password.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
										</>
									);
								})}

								<span data-testid="users_length">{fieldsInfo.length}</span>

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.insert(2, newUser)}
								>
									Insert user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(<ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");
		const usersLength = screen.getByTestId("users_length");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);
		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();
		expect(usersLength).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);
		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);
		expect(usersLength).toHaveTextContent("10");

		await userEvent.click(actionButton);

		expect(usersLength).toHaveTextContent("11");
		expect(screen.getByTestId(`users.username.2`)).toHaveValue(
			newUser.username
		);
		expect(screen.getByTestId(`users.password.2`)).toHaveValue(
			newUser.password
		);
	});

	it("Shift", async ({ expect }) => {
		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo.map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												<BindingFieldInput>
													<input data-testid={`users.username.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												<BindingFieldInput>
													<input data-testid={`users.password.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
										</>
									);
								})}

								<span data-testid="users_length">{fieldsInfo.length}</span>

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.shift()}
								>
									Shift user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(<ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");
		const usersLength = screen.getByTestId("users_length");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);
		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();
		expect(usersLength).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);
		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);
		expect(usersLength).toHaveTextContent("10");

		await userEvent.click(actionButton);

		expect(usersLength).toHaveTextContent("9");
	});

	it("Unshift", async ({ expect }) => {
		const user: User = {
			username: "user abc",
			password: "secret_password_abc",
		};

		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo.map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												<BindingFieldInput>
													<input data-testid={`users.username.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												<BindingFieldInput>
													<input data-testid={`users.password.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
										</>
									);
								})}

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.unshift(user)}
								>
									Unshift user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(<ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);

		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);

		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);

		await userEvent.click(actionButton);

		expect(screen.getByTestId("users.username.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.0")).toHaveValue(user.username);
		expect(screen.getByTestId("users.password.0")).toHaveValue(user.password);
	});

	it("Replace", async ({ expect }) => {
		const user: User = {
			username: "user abc",
			password: "secret_password_abc",
		};

		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo.map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												<BindingFieldInput>
													<input data-testid={`users.username.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												<BindingFieldInput>
													<input data-testid={`users.password.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
										</>
									);
								})}

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.replace(0, user)}
								>
									Unshift user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(<ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);

		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);

		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);

		await userEvent.click(actionButton);

		expect(screen.getByTestId("users.username.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.0")).toHaveValue(user.username);
		expect(screen.getByTestId("users.password.0")).toHaveValue(user.password);
	});

	it("Remove", async ({ expect }) => {
		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo.map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												<BindingFieldInput>
													<input data-testid={`users.username.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												<BindingFieldInput>
													<input data-testid={`users.password.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
										</>
									);
								})}

								<span data-testid="users_length">{fieldsInfo.length}</span>

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.remove(0)}
								>
									Pop user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(<ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");
		const usersLength = screen.getByTestId("users_length");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);
		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();
		expect(usersLength).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);
		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);
		expect(usersLength).toHaveTextContent("10");

		await userEvent.click(actionButton);

		expect(usersLength).toHaveTextContent("9");
	});

	it("Move", async ({ expect }) => {
		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo.map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												<BindingFieldInput>
													<input data-testid={`users.username.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												<BindingFieldInput>
													<input data-testid={`users.password.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
										</>
									);
								})}

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.move(0, 9)}
								>
									Unshift user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(<ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);

		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);

		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);

		await userEvent.click(actionButton);

		expect(screen.getByTestId("users.username.9")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.9")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.9")).toHaveValue(
			formData.users[0]?.username
		);
		expect(screen.getByTestId("users.password.9")).toHaveValue(
			formData.users[0]?.password
		);
	});

	it("Swap", async ({ expect }) => {
		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo.map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												<BindingFieldInput>
													<input data-testid={`users.username.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												<BindingFieldInput>
													<input data-testid={`users.password.${index}`} />
												</BindingFieldInput>
											</fieldArray.Field>
										</>
									);
								})}

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.swap(0, 9)}
								>
									Unshift user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(<ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);

		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);

		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);

		await userEvent.click(actionButton);

		expect(screen.getByTestId("users.username.9")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.9")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.9")).toHaveValue(
			formData.users[0]?.username
		);
		expect(screen.getByTestId("users.password.9")).toHaveValue(
			formData.users[0]?.password
		);

		expect(screen.getByTestId("users.username.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.0")).toHaveValue(
			formData.users[9]?.username
		);
		expect(screen.getByTestId("users.password.0")).toHaveValue(
			formData.users[9]?.password
		);
	});
});
