import {useState} from "react";

export default function App() {

	const [loading, setLoading] = useState(false)
	const [query, setQuery] = useState('')
	const [result, setResult] = useState(false)

	const submitHandle = e => {
		e.preventDefault()
		setLoading(true)
		setResult(false)
		fetch('http://localhost:3000', {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				query
			})
		})
			.then(res => res.json())
			.then(res => {
				setResult(res)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<div className="container mx-auto py-6">
			<form className="mb-6" onSubmit={submitHandle}>
			<textarea
				value={query}
				placeholder="Rapor için isteğinizi buraya yazın"
				onChange={e => setQuery(e.target.value)}
				className="w-full h-[120px] border rounded-md p-4 text-lg outline-none focus:border-black"
			/>
				<button
					disabled={loading || !query}
					type="submit"
					className="h-10 px-6 rounded-md bg-black text-white text-sm disabled:opacity-50"
				>
					Oluştur
				</button>
			</form>

			{loading && <p className="text-lg text-center">Rapor oluşturuluyor..</p>}

			{result && (
				<>
					{result.error && (
						<div className="bg-red-50 border border-red-600/20 p-4 text-lg text-red-800 p-4 rounded-md mb-4">
							Bir hata olustu!
						</div>
					) || (
						<>
							<pre className="bg-blue-50 overflow-auto border border-blue-600/20 p-4 text-lg text-blue-800 p-4 rounded-md mb-4">{result.query}</pre>

							<table className="w-full border rounded-md text-sm">
								<thead>
								<tr>
									{Object.entries(result.fields).map(([key, value]) => (
										<th className="py-3 font-medium text-zinc-600 text-left px-5">
											{value}
										</th>
									))}
								</tr>
								</thead>
								<tbody>
								{result.results.map(data => (
									<tr>
										{Object.entries(data).map(([key, value]) => (
											<td className="px-5 py-3 border-t">
												{value}
											</td>
										))}
									</tr>
								))}
								</tbody>
							</table>
						</>
					)}

				</>
			)}

		</div>
	)
}
