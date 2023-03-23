export default function runWithCancel(fn, ...args) {
	const gen = fn(...args);
	let cancelled, cancel;
	const promise = new Promise((resolve, reject) => {
		cancel = () => {
			cancelled = true;
			reject({ reason: "cancelled" });
		};

		let value;

		onFulfilled();

		function onFulfilled(res) {
			if (!cancelled) {
				let result;
				try {
					result = gen.next(res);
				} catch (e) {
					return reject(e);
				}
				next(result);
				return null;
			}
		}

		function onRejected(err) {
			var result;
			try {
				result = gen.throw(err);
			} catch (e) {
				return reject(e);
			}
			next(result);
		}

		function next({ done, value }) {
			if (done) {
				return resolve(value);
			}
			return value.then(onFulfilled, onRejected);
		}
	});

	return { promise, cancel };
}