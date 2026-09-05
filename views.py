import re
import requests
from main import app
from flask import render_template, request, jsonify

VIACEP_URL = "https://viacep.com.br/ws/{cep}/json/"


def extract_zip_code(text):
	#Extract and strip any other non-digit from 8 digits CEP
	digits = re.sub(r"\D", "", text)
	if len(digits) == 8:
		return digits
	return None


# Flask routes
@app.route("/")
def homepage():
	return render_template("index.html")


@app.route("/api/message", methods=["POST"])
def message():
	# Expects JSON like {"message": "01310-100"} from the front-end
	data = request.get_json(silent=True) or {}
	text = data.get("message", "")

	cep = extract_zip_code(text)
	if not cep:
		# No valid 8-digit CEP found in the user's message
		return jsonify({
			"type": "error",
			"reply": "Não encontrei um CEP válido na sua mensagem. "
					 "Envie um CEP com 8 dígitos, ex: 01310-100."
		})

	try:
		# Query the ViaCEP API for the given CEP
		resp = requests.get(VIACEP_URL.format(cep=cep), timeout=5)
		resp.raise_for_status()
		info = resp.json()
	except requests.RequestException:
		# Network error
		return jsonify({
			"type": "error",
			"reply": "Não consegui falar com o ViaCEP agora. Tente novamente em instantes."
		})

	if info.get("erro"):
		# ViaCEP responds with {"erro": true} for a well-formed but nonexistent CEP
		return jsonify({
			"type": "error",
			"reply": f"CEP {cep} não foi encontrado."
		})

	return jsonify({
		"type": "success",
		"cep": info.get("cep"),
		"street": info.get("logradouro"),
		"neighborhood": info.get("bairro"),
		"city": info.get("localidade"),
		"state": info.get("uf"),
		"raw": info
	})
