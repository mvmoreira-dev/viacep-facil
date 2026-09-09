import re
import requests
from urllib.parse import quote
from main import app
from flask import render_template, request, jsonify

VIACEP_URL = "https://viacep.com.br/ws/{cep}/json/"
VIACEP_ALT_URL = "https://viacep.com.br/ws/{state}/{city}/{street}/json/"


def extract_zip_code(text):
	#Extract and strip any other non-digit from 8 digits CEP
	digits = re.sub(r"\D", "", text)
	if len(digits) == 8:
		return digits
	return None

def search_by_address(state, city, street):
	url = VIACEP_ALT_URL.format(
		state=quote(state),
		city=quote(city),
		street=quote(street)
	)

	resp = requests.get(url, timeout=5)
	resp.raise_for_status()
	return resp.json()

# Flask routes
@app.route("/")
def homepage():
	return render_template("index.html")


@app.route("/api/message", methods=["POST"])
def message():
    data = request.get_json(silent=True) or {}
    text = data.get("message", "").strip()

    # First try: CEP
    cep = extract_zip_code(text)

    if cep:
        try:
            resp = requests.get(VIACEP_URL.format(cep=cep), timeout=5)
            resp.raise_for_status()
            info = resp.json()

            if info.get("erro"):
                return jsonify({
                    "type": "error",
                    "reply": f"CEP {cep} não encontrado."
                })

            return jsonify({
                "type": "success",
                "raw": info
            })

        except requests.RequestException:
            return jsonify({
                "type": "error",
                "reply": "Erro ao consultar o ViaCEP."
            })

    # Second try: UF City Street
    parts = [p.strip() for p in text.split(",")]

    if len(parts) != 3:
        return jsonify({
            "type": "error",
            "reply": (
                "Envie um CEP ou no formato:\n"
                "UF, Cidade, Logradouro\n"
                "Exemplo:\n"
                "SP, São Paulo, Avenida Paulista"
            )
        })

    state, city, street = parts

    try:
        results = search_by_address(state, city, street)
    except requests.RequestException:
        return jsonify({
            "type": "error",
            "reply": "Erro ao consultar o ViaCEP."
        })

    if not results:
        return jsonify({
            "type": "error",
            "reply": "Nenhum endereço encontrado."
        })

    return jsonify({
        "type": "success",
        "results": results
    })
