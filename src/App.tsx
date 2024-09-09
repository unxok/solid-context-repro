import {
	Accessor,
	createContext,
	createSignal,
	onCleanup,
	onMount,
	Setter,
	useContext,
} from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { DOMElement } from "solid-js/jsx-runtime";

type Count = {
	num: number;
};

type CounterContextProps = {
	countStore: Count;
	setCountStore: SetStoreFunction<Count>;
	signalCount: Accessor<number>;
	setSignalCount: Setter<number>;
};

const defaultContext: CounterContextProps = {
	countStore: { num: 0 },
	setCountStore: () => {},
	signalCount: () => 0,
	setSignalCount: () => {},
};

const CounterContext = createContext(defaultContext);

function App() {
	const [countStore, setCountStore] = createStore<Count>({
		num: 0,
	});
	const [signalCount, setSignalCount] = createSignal(0);

	return (
		<CounterContext.Provider
			value={{ countStore, setCountStore, signalCount, setSignalCount }}
		>
			<div class='button-container'>
				<ConsumerStore />
				<ConsumerSignal />
			</div>
		</CounterContext.Provider>
	);
}

export default App;

const ConsumerStore = () => {
	const ctx = useContext(CounterContext);

	const increment = (e: MouseEvent) => {
		const attr = (e as MouseEvent & { target: DOMElement }).target.getAttribute(
			"data-increment-store"
		);
		if (attr === null) return;
		ctx.setCountStore((prev) => ({ num: prev.num + 2 }));
	};

	onMount(() => {
		document.addEventListener("click", increment);
	});

	onCleanup(() => {
		document.removeEventListener("click", increment);
	});

	return (
		<div class='box'>
			<h2>storeCount: {ctx.countStore.num}</h2>
			<div class='button-container'>
				<p>Listener attached to document</p>
				<button data-increment-store={true}>+2</button>
			</div>
			<div class='button-container'>
				<p>Listener attached to button directly</p>
				<button
					onClick={() => {
						ctx.setCountStore((prev) => ({ num: prev.num + 1 }));
					}}
				>
					+1
				</button>
			</div>
		</div>
	);
};

const ConsumerSignal = () => {
	const ctx = useContext(CounterContext);

	const increment = (e: MouseEvent) => {
		const attr = (e as MouseEvent & { target: DOMElement }).target.getAttribute(
			"data-increment-signal"
		);
		if (attr === null) return;
		ctx.setSignalCount((prev) => prev + 2);
	};

	onMount(() => {
		document.addEventListener("click", increment);
	});

	onCleanup(() => {
		document.removeEventListener("click", increment);
	});

	return (
		<div class='box'>
			<h2>signalCount: {ctx.signalCount()}</h2>
			<div class='button-container'>
				<p>Listener attached to document</p>
				<button data-increment-signal={true}>+2</button>
			</div>
			<div class='button-container'>
				<p>Listener attached to button directly</p>
				<button
					onClick={() => {
						ctx.setSignalCount((prev) => prev + 1);
					}}
				>
					+1
				</button>
			</div>
		</div>
	);
};
