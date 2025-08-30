# /qr-code-generator/app.py

import qrcode
import base64
from io import BytesIO
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_qr', methods=['POST'])
def generate_qr():
    req_data = request.get_json()

    if not req_data or 'data' not in req_data:
        return jsonify({'error': 'No data provided'}), 400

    text_data = req_data['data']

    if not text_data.strip():
        return jsonify({'error': 'Data cannot be empty'}), 400

    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(text_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return jsonify({'qr_code_image': f"data:image/png;base64,{img_str}"})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'Failed to generate QR code'}), 500

if __name__ == '__main__':
    app.run(debug=True)