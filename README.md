# ViaCEP Fácil

Chatbot simples em Flask que consulta endereços a partir de um CEP, usando a API pública do [ViaCEP](https://viacep.com.br/).

## Como funciona

1. O usuário digita um CEP (com ou sem traço/pontuação) no campo de mensagem.
2. O front-end (`chat.js`) envia o texto para o backend via `POST /api/message`.
3. O backend (`views.py`) extrai os 8 dígitos do CEP, consulta a API do ViaCEP e retorna:
   - Rua, bairro, cidade e estado, se o CEP for válido.
   - Uma mensagem de erro, se o CEP for inválido, não existir ou se o ViaCEP estiver fora do ar.
4. A resposta aparece no chat como uma mensagem do bot.

## Estrutura

```
viacep-chatbot/
├── main.py              # inicializa a aplicação Flask
├── views.py             # rotas: página inicial e /api/message
├── templates/
│   └── index.html       # estrutura da página (chat + canvas de fundo)
└── static/
    ├── css/style.css    # estilo do chat e do fundo animado
    ├── js/chat.js        # lógica do chat (envio/exibição de mensagens)
    ├── js/background.js  # animação de fundo (pontos em onda)
    └── favicon.png
```

## Rodando localmente

```bash
pip install flask requests
python main.py
```

A aplicação sobe em `http://127.0.0.1:5000/` (modo debug).

## Exemplo de uso

Digite no chat:

```
70150-900
```

E o bot responde com rua, bairro, cidade e estado correspondentes.
