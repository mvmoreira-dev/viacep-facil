const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messagesEl = document.getElementById("messages");

function addMessage(text, author) {
	const div = document.createElement("div");
	div.className = `msg ${author}`;
	div.textContent = text;
	messagesEl.appendChild(div);
	messagesEl.scrollTop = messagesEl.scrollHeight;
}

function formatReply(data) {
	if (data.type === "error") {
		return data.reply;
	}
	return (
		`CEP: ${data.cep}\n` +
		`Rua: ${data.street || "-"}\n` +
		`Bairro: ${data.neighborhood || "-"}\n` +
		`Cidade: ${data.city || "-"} - ${data.state || "-"}`
	);
}

async function sendMessage(text) {
	try {
		const resp = await fetch("/api/message", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: text })
		});
		const data = await resp.json();
		addMessage(formatReply(data), "bot");
	} catch (err) {
		addMessage("Erro ao conectar com o servidor.", "bot");
	}
}

form.addEventListener("submit", (event) => {
	event.preventDefault();
	const text = input.value.trim();
	if (!text) return;

	addMessage(text, "user");
	input.value = "";
	sendMessage(text);
});

// Initial greeting shown when the page loads.
addMessage("Olá, Bem-vindo ao ViaCep Fácil! Me envie um CEP (ex: 70150-900) que eu busco o endereço pra você", "bot");
