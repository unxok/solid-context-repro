/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

const root = document.getElementById("root");
const root1 = document.getElementById("root1");

render(() => <App />, root!);
render(() => <App />, root1!);
