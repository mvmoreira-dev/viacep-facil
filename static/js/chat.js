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

    // Search for address
    if (data.results) {
        return data.results.map(item =>
            `CEP: ${item.cep}\n` +
            `Rua: ${item.logradouro || "-"}\n` +
            `Bairro: ${item.bairro || "-"}\n` +
            `Cidade: ${item.localidade || "-"} - ${item.uf || "-"}`
        ).join("\n\n");
    }

    const info = data.raw || {};

    // Search for CEP
    return (
        `CEP: ${info.cep || "-"}\n` +
        `Rua: ${info.logradouro || "-"}\n` +
        `Bairro: ${info.bairro || "-"}\n` +
        `Cidade: ${info.localidade || "-"} - ${info.uf || "-"}`
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
addMessage("Olá, Bem-vindo ao ViaCEP Fácil! Envie um CEP (ex: 70150-900) ou um endereço especificando, na seguinte ordem: Estado, Cidade e Rua, que eu busco o endereço pra você.", "bot");
