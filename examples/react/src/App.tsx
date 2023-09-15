import { asyncFieldSchema, asyncSchema, useForm } from "@niku/ez-form-react";
import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
			<LoginPage />
		</>
	);
}

export default App;

interface LoginForm {
	username: string;
	password: string;
	addresses: {
		lineOne: string;
		lineTwo: string;
	}[];
}

function LoginPage() {
	const form = useForm<LoginForm>({
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

	return (
		<form.Form>
			<form {...form.getFormProps()}>
				<form.Observe>
					{({ values }) => <span>{JSON.stringify(values)}</span>}
				</form.Observe>
				<br />
				<form.Field name="username">
					<input data-testid="usernameInput" />
				</form.Field>
				<form.Field
					name="password"
					validationSchema={asyncFieldSchema({
						type: "string",
						pattern: new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$"),
						required: true,
					})}
				>
					<input data-testid="passwordInput" type="password" />
				</form.Field>

				<br />

				<form.FieldArray name="addresses">
					{({ fieldArray, fieldsInfo }) => {
						return (
							<>
								{fieldsInfo.map((field) => {
									return (
										<div key={field.key}>
											<fieldArray.Field index={field.index} name="lineOne">
												<input />
											</fieldArray.Field>
											<br />
											<fieldArray.Field index={field.index} name="lineTwo">
												<input />
											</fieldArray.Field>
										</div>
									);
								})}
								<br />
								<button
									onClick={() =>
										fieldArray.push({
											lineOne: "abc",
											lineTwo: "def",
										})
									}
								>
									Add new
								</button>
								<button
									onClick={() =>
										fieldArray.insert(2, {
											lineOne: "def",
											lineTwo: "asdfasdf",
										})
									}
								>
									Insert
								</button>
								<button onClick={() => fieldArray.pop()}>Pop</button>
								<button onClick={() => fieldArray.swap(0, 1)}>Swap</button>
							</>
						);
					}}
				</form.FieldArray>
			</form>
		</form.Form>
	);
}
